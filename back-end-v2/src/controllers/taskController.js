const connection = require("../utils/database");
const { sendEmail } = require("../utils/emailer");
const { checkPermits } = require("./authController");

function updateNotes(oldTaskStatus, newTaskStatus, newTaskNotes, user) {
  const today = new Date();
  let taskNotes;
  taskNotes = `${today}\nTask status changed from '${oldTaskStatus}' to '${newTaskStatus}'. Task edited by ${user}.`;
  taskNotes = newTaskNotes ? taskNotes + `\n\nAdditional Notes from ${user}: \n` + newTaskNotes : taskNotes;
  taskNotes = taskNotes + "\n========================================\n";

  return taskNotes;
}

exports.GetTaskByState = async (req, res, next) => {
  try {
    const { task_app_acronym, task_status } = req.body;
    if (task_status !== "open" && task_status !== "todo" && task_status !== "doing" && task_status !== "done" && task_status !== "closed") {
      return res.status(404).json({
        code: "E1"
      });
    }

    const [row, fields] = await connection.query("SELECT * FROM tasks WHERE task_app_acronym = ?", task_app_acronym);

    if (row.length > 0) {
      return res.status(200).json({
        code: "S1",
        results: row.filter(item => item.task_status === task_status)
      });
    } else {
      return res.status(404).json({
        code: "E2"
      });
    }
  } catch (error) {
    return res.status(400).json({
      code: "GG420"
    });
  }
};

exports.CreateTask = async (req, res, next) => {
  try {
    if (!/^(?=.{1,45}$)[a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+)*$/.test(req.body.task_name) > 0) {
      return res.status(400).json({
        code: "E1"
      });
    }

    if (req.body.task_plan) {
      const [planRow, planFields] = await connection.query("SELECT * FROM plans WHERE plan_mvp_name = ? AND plan_app_acronym = ?", [req.body.task_plan, req.body.task_app_acronym]);
      if (planRow.length === 0) {
        return res.status(400).json({
          code: "E4"
        });
      }
    }

    //get app running number
    const [row, fields] = await connection.query("SELECT app_rnumber FROM applications WHERE app_acronym = ?", req.body.task_app_acronym);

    //if app exists and there is app running number
    if (row.length === 1) {
      const rNum = row[0].app_rnumber + 1;
      const taskID = req.body.task_app_acronym + "_" + rNum;
      const today = new Date();

      //put in task notes
      let taskNotes = updateNotes("Create", "Open", req.body.task_notes, req.user.username);

      // update database
      const response = await connection.query(`INSERT INTO tasks VALUES (?,?,?,?,?,?,?,?,?,?)`, [req.body.task_name, taskID, req.body.task_description, "open", req.user.username, req.user.username, today.toLocaleDateString("en-CA"), taskNotes, req.body.task_plan, req.body.task_app_acronym]);

      if (response) {
        const responseApp = await connection.query(`UPDATE applications SET app_rnumber = ? WHERE app_acronym = ?;`, [rNum, req.body.task_app_acronym]);
      } else {
        throw new Error(`Error: Cannot add task ${req.body.task_name} with ID of ${taskID}`);
      }
      return res.status(201).json({
        code: "S1",
        task_id: taskID
      });
    } else {
      //app does not exist
      return res.status(400).json({
        code: "A2"
      });
    }
  } catch (error) {
    console.log(error);
    if (error.code == "ER_DATA_TOO_LONG" && error.sqlMessage.includes("task_description")) {
      return res.status(400).json({
        code: "E2"
      });
    }
    if (error.code == "ER_DATA_TOO_LONG" && error.sqlMessage.includes("task_notes")) {
      return res.status(400).json({
        code: "E3"
      });
    }
    return res.status(500).json({
      code: "GG420"
    });
  }
};

exports.PromoteTask2Done = async (req, res, next) => {
  try {
    /**
     * DOING TASK
     * Permissions: Only Dev team persona -> permit checked by middleware
     * Actions Allowed:
     * 1. Save - Add notes -> input expected (task_notes)
     * 2. Save - Change description - Input expected (task_description)
     * 3. Save & Promote -> Go to Done - Input expected (action: none/demote/promote)
     * 4. Save & Demote -> Go to To Do - Input expected (action: none/demote/promote)
     *
     * Other inputs: app_acronym, task_id
     */

    let taskNotes = updateNotes("Doing", "Done", req.body.task_notes, req.user.username);

    const [row, fields] = await connection.query("SELECT task_status FROM tasks WHERE task_id = ?", req.body.task_id);

    if (row.length === 1) {
      if (row[0].task_status !== "doing") {
        return res.status(404).json({
          code: "E2"
        });
      }
    } else {
      return res.status(404).json({
        code: "E1"
      });
    }

    const response = await connection.query(
      `UPDATE tasks SET 
        task_description = ?, 
        task_status = ?, 
        task_owner = ?, 
        task_notes = CONCAT(?, task_notes)
        WHERE task_id = ? AND task_status = ?`,
      [req.body.task_description, "done", req.user.username, taskNotes, req.body.task_id, "doing"]
    );

    if (response[0].changedRows === 1) {
      // Send email for promotion of doing task to done

      const groupname = await checkPermits("done", req.body.task_app_acronym);

      if (groupname.length > 0) {
        const [row, fields] = await connection.query(`SELECT email FROM accounts WHERE groupname = ? OR groupname LIKE ? OR groupname LIKE ? OR groupname LIKE ?;`, [groupname, `%, ${groupname}`, `${groupname}, %`, `%, ${groupname}, %`]);
        const resUser = row.map(user => user.email);

        if (resUser.length > 0) {
          sendEmail(
            resUser,
            `${req.body.task_id} has been promoted to Done`,
            `<div><font face="arial, sans-serif"><i>[This is an auto generated response. Please do not reply to this email]</i></font></div>
              <br>
              <font face="arial, sans-serif">Dear user,</font><div>
              <br>
            <div><font face="arial, sans-serif">Please note that task ${req.body.task_id} has been promoted to done by ${req.user.username}. Please proceed to <a href="http://localhost:3000/apps/${req.body.app_acronym}" style="color: rgb(17, 85, 204);">http://localhost:3000/apps/${req.body.app_acronym}</a> to approve (promote), or reject the task closure (demote) and reassign the plan if required. </font></div>
            <br>
            <div><font face="arial, sans-serif">Regards,</font></div><div><font face="arial, sans-serif">TMS Support Team</font></div></div>`
          );
          return res.status(200).json({
            task_id: req.body.task_id,
            code: "S1"
          });
        } else {
          throw new Error("Error: No users found for project lead group. Failed to send email");
        }
      } else {
        throw new Error("Error: No groupname found for project lead. Failed to send email");
      }
    } else {
      return res.status(404).json({
        code: "E2"
      });
    }
  } catch (error) {
    console.log(error);

    if (error.code == "ER_DATA_TOO_LONG" && error.sqlMessage.includes("task_notes")) {
      return res.status(400).json({
        code: "E3"
      });
    }
    return res.status(500).json({
      code: "GG420"
    });
  }
};
