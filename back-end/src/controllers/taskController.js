const connection = require("../utils/database");

exports.getTasksOfApp = async (req, res, next) => {
  try {
    const [row, fields] = await connection.query("SELECT * FROM tasks WHERE task_app_acronym = ?", req.body.task_app_acronym);
    console.log("row", row);

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

exports.createTask = async (req, res, next) => {
  try {
    if (req.body.task_name.search(/[^a-zA-Z0-9\s]/g) > 0) throw new Error("Error: Task Name should not contain special characters.");

    //get app running number
    const [row, fields] = await connection.query("SELECT app_rnumber FROM applications WHERE app_acronym = ?", req.body.task_app_acronym);

    //if app exists and there is app running number
    if (row.length === 1) {
      const rNum = row[0].app_rnumber + 1;
      const taskID = req.body.task_app_acronym + "_" + rNum;
      const today = new Date();

      //put in task notes
      let taskNotes = `========================================\n${today} - Task status changed from 'Create' to 'Open'. Task edited by ${req.user.username}.\n========================================\n`;
      taskNotes = req.body.task_notes ? taskNotes + "NOTES: \n" + req.body.task_notes : taskNotes;
      console.log("taskID", taskID);
      console.log(taskNotes);

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
    const today = new Date();
    let taskNotes = `\n========================================\n${today} - Task status changed from 'Open' to '${req.body.action === "promote" ? "To Do" : "Open"}'. Task edited by ${req.user.username}.\n========================================\n`;
    taskNotes = req.body.task_notes ? taskNotes + "NOTES: \n" + req.body.task_notes : taskNotes;

    const response = await connection.query(
      `UPDATE tasks SET 
        task_description = ?, 
        task_status = ?, 
        task_owner = ?, 
        task_notes = CONCAT(task_notes, ?), 
        task_plan = ? 
        WHERE task_id = ?`,
      [req.body.task_description, taskStatus, req.user.username, taskNotes, req.body.task_plan, req.body.task_id]
    );

    return res.status(200).json({
      success: true,
      message: `Task ${req.body.task_id} has been updated`
    });
  } catch (error) {
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
  } catch (error) {
    return res.status(error.message.includes("Error") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};
