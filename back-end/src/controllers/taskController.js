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

exports.getTasksOfApp = async (req, res, next) => {
  try {
    const [row, fields] = await connection.query("SELECT * FROM tasks WHERE task_app_acronym = ?", req.body.task_app_acronym);

    if (row.length > 0) {
      return res.status(200).json({
        success: true,
        message: `Retrieved all tasks`,
        results: row
      });
    } else {
      return res.status(200).json({
        success: true,
        message: `There are no tasks`
      });
    }
  } catch (error) {
    return res.status(error.message.includes("Error") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.getSelectedTask = async (req, res, next) => {
  try {
    const [row, fields] = await connection.query("SELECT * FROM tasks WHERE task_id = ?", req.body.task_id);

    if (row.length === 1) {
      return res.status(200).json({
        success: true,
        message: `Retrieved task ${req.body.task_id}`,
        results: row[0]
      });
    } else {
      throw new Error("Error: Task does not exist");
    }
  } catch (error) {
    return res.status(error.message.includes("Error") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.createTask = async (req, res, next) => {
  try {
    if (!/^(?=.{1,45}$)[a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+)*$/.test(req.body.task_name) > 0) throw new Error("Error: Task Name should not be more than 45 characters, should not contain special characters, leading and trailing spaces.");

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
        success: true,
        message: `Task ${req.body.task_name} with ID of ${taskID} has been created`
      });
    } else {
      throw new Error("Error: Application does not exist");
    }
  } catch (error) {
    if (error.code == "ER_DATA_TOO_LONG") {
      return res.status(400).json({
        success: false,
        error,
        message: "Error: Description exceeded 255 characters",
        stack: error.stack
      });
    }
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error,
        message: "Error: Task already exists",
        stack: error.stack
      });
    }
    return res.status(error.message.includes("Error") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.updateOpenTask = async (req, res, next) => {
  try {
    /**
     * OPEN TASK
     * Permissions: Only PM persona-> permit checked by middleware
     * Actions Allowed:
     * 1. Save - Add/Change plan -> input expected (task_plan)
     * 2. Save - Add notes -> input expected (task_notes)
     * 3. Save - Change description - Input expected (task_description)
     * 4. Save & Promote -> Release to devteam persona - Input expected (action: none/promote)
     *
     * Other inputs: app_acronym, task_id
     * Note: No Demotion
     */
    const taskStatus = req.body.action === "promote" ? "todo" : "open";
    let taskNotes = updateNotes("Open", req.body.action === "promote" ? "To Do" : "Open", req.body.task_notes, req.user.username);
    // let taskNotes = `\n========================================\n${today} - Task status changed from 'Open' to '${req.body.action === "promote" ? "To Do" : "Open"}'. Task edited by ${req.user.username}.\n========================================\n`;
    // taskNotes = req.body.task_notes ? taskNotes + "NOTES: \n" + req.body.task_notes : taskNotes;

    const response = await connection.query(
      `UPDATE tasks SET 
        task_description = ?, 
        task_status = ?, 
        task_owner = ?, 
        task_notes = CONCAT(?, task_notes), 
        task_plan = ? 
        WHERE task_id = ? AND task_status = ?`,
      [req.body.task_description, taskStatus, req.user.username, taskNotes, req.body.task_plan, req.body.task_id, "open"]
    );

    if (response[0].changedRows === 1) {
      return res.status(200).json({
        success: true,
        message: `Task ${req.body.task_id} has been updated`
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Task ${req.body.task_id} was not updated as it was already modified by another user. Please refresh to view the updated task.`
      });
    }
  } catch (error) {
    if (error.code == "ER_DATA_TOO_LONG") {
      return res.status(400).json({
        success: false,
        error,
        message: "Error: Description exceeded 255 characters",
        stack: error.stack
      });
    }
    return res.status(error.message.includes("Error") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.updateToDoTask = async (req, res, next) => {
  try {
    /**
     * TO DO TASK
     * Permissions: Only Dev team persona -> permit checked by middleware
     * Actions Allowed:
     * 1. Save - Add notes -> input expected (task_notes)
     * 2. Save - Change description - Input expected (task_description)
     * 3. Save & Promote -> Go to Doing - Input expected (action: none/promote)
     *
     * Other inputs: app_acronym, task_id
     * Note: No Demotion
     */

    const taskStatus = req.body.action === "promote" ? "doing" : "todo";
    let taskNotes = updateNotes("To Do", req.body.action === "promote" ? "Doing" : "To Do", req.body.task_notes, req.user.username);

    const response = await connection.query(
      `UPDATE tasks SET 
        task_description = ?, 
        task_status = ?, 
        task_owner = ?, 
        task_notes = CONCAT(?, task_notes)
        WHERE task_id = ? AND task_status = ?`,
      [req.body.task_description, taskStatus, req.user.username, taskNotes, req.body.task_id, "todo"]
    );

    if (response[0].changedRows === 1) {
      return res.status(200).json({
        success: true,
        message: `Task ${req.body.task_id} has been updated`
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Task ${req.body.task_id} was not updated as it was already modified by another user. Please refresh to view the updated task.`
      });
    }
  } catch (error) {
    if (error.code == "ER_DATA_TOO_LONG") {
      return res.status(400).json({
        success: false,
        error,
        message: "Error: Description exceeded 255 characters",
        stack: error.stack
      });
    }
    return res.status(error.message.includes("Error") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.updateDoingTask = async (req, res, next) => {
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

    let taskStatus, notesTaskStatus;
    switch (req.body.action) {
      case "promote":
        taskStatus = "done";
        notesTaskStatus = "Done";
        break;
      case "demote":
        taskStatus = "todo";
        notesTaskStatus = "To Do";
        break;
      default:
        taskStatus = "doing";
        notesTaskStatus = "Doing";
    }
    let taskNotes = updateNotes("Doing", notesTaskStatus, req.body.task_notes, req.user.username);

    const response = await connection.query(
      `UPDATE tasks SET 
        task_description = ?, 
        task_status = ?, 
        task_owner = ?, 
        task_notes = CONCAT(?, task_notes)
        WHERE task_id = ? AND task_status = ?`,
      [req.body.task_description, taskStatus, req.user.username, taskNotes, req.body.task_id, "doing"]
    );
    console.log("doing");

    if (response[0].changedRows === 1) {
      // Send email for promotion of doing task to done
      if (req.body.action === "promote") {
        const groupname = await checkPermits("done", req.body.app_acronym);

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
              success: true,
              message: `Task ${req.body.task_id} has been updated`
            });
          } else {
            throw new Error("Error: No users found for project lead group. Failed to send email");
          }
        } else {
          throw new Error("Error: No groupname found for project lead. Failed to send email");
        }
      } else {
        return res.status(200).json({
          success: true,
          message: `Task ${req.body.task_id} has been updated`
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: `Task ${req.body.task_id} was not updated as it was already modified by another user. Please refresh to view the updated task.`
      });
    }
    // return res.status(200).json({
    //   success: true,
    //   message: `Task ${req.body.task_id} has been updated`
    // });
  } catch (error) {
    if (error.code == "ER_DATA_TOO_LONG") {
      return res.status(400).json({
        success: false,
        error,
        message: "Error: Description exceeded 255 characters",
        stack: error.stack
      });
    }
    return res.status(error.message.includes("Error") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.updateDoneTask = async (req, res, next) => {
  try {
    /**
     * DONE TASK
     * Permissions: Only PL team persona -> permit checked by middleware
     * Actions Allowed:
     * 1. Save - Add notes -> input expected (task_notes)
     * 2. Save - Change description - Input expected (task_description)
     * 3. Save & Promote -> Go to Done - Input expected (action: none/demote/promote)
     * 4. Save & Demote -> Go to To Do - Input expected (task_plan, action: none/demote/promote)
     *
     * Other inputs: app_acronym, task_id
     * Note: if there is task_plan but the action is not demote -> reject;
     */

    let taskStatus, notesTaskStatus;
    switch (req.body.action) {
      case "promote":
        taskStatus = "closed";
        notesTaskStatus = "Closed";
        break;
      case "demote":
        taskStatus = "doing";
        notesTaskStatus = "Doing";
        break;
      default:
        taskStatus = "done";
        notesTaskStatus = "Done";
    }
    let taskNotes = updateNotes("Done", notesTaskStatus, req.body.task_notes, req.user.username);

    let sqlBuilder = `UPDATE tasks SET task_description = ?, task_status = ?, task_owner = ?, task_notes = CONCAT(?, task_notes)`;
    let sqlValues = [req.body.task_description, taskStatus, req.user.username, taskNotes];
    if (req.body.task_plan) {
      if (req.body.action !== "demote") throw new Error("Error: Cannot change task plan when promoting or no change in task status");
      sqlBuilder = sqlBuilder + `, task_plan = ?`;
      sqlValues.push(req.body.task_plan);
    }

    sqlBuilder = sqlBuilder + ` WHERE task_id = ? AND task_status = ?;`;
    sqlValues.push(req.body.task_id);
    sqlValues.push("done");

    const response = await connection.query(sqlBuilder, sqlValues);

    if (response[0].changedRows === 1) {
      return res.status(200).json({
        success: true,
        message: `Task ${req.body.task_id} has been updated`
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Task ${req.body.task_id} was not updated as it was already modified by another user. Please refresh to view the updated task.`
      });
    }
  } catch (error) {
    if (error.code == "ER_DATA_TOO_LONG") {
      return res.status(400).json({
        success: false,
        error,
        message: "Error: Description exceeded 255 characters",
        stack: error.stack
      });
    }
    return res.status(error.message.includes("Error") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};
