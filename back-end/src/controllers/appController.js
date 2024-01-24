const connection = require("../utils/database");

function checkRNum(rNum) {
  if (rNum === null) throw new Error("Error: App running number should not be blank");
  if (rNum > 100000 || rNum < 0) throw new Error("Error: App running number should be between 0 and 100,000");
  if (/[^0-9]/g.test(rNum)) throw new Error("Error: App running number should be a whole number");
}

function checkAcronym(acronym) {
  if (!acronym) throw new Error("Error: App Acronym should not be blank");
  if (!/^[a-zA-Z][a-zA-Z0-9]{0,44}$/g.test(acronym)) throw new Error("Error: App Acronym should not be more than 45 characters, should not contain special characters and spaces, and should be alphabets or alphabets with numbers.");
  // if (acronym > 45) throw new Error("Error: App Acronym should be not be more than 45 characters.");
  // if (acronym.search(/[^a-zA-Z0-9]/g) > 0) throw new Error("Error: App Acronym should not contain special characters and spaces.");
  // if (/^[A-Za-z0-9]*$/.test(acronym) === false) throw new Error("Error: App Acronym should be alphabets or alphanumeric.");
}

exports.getApps = async (req, res, next) => {
  try {
    const [row, fields] = await connection.query("SELECT * FROM applications;", null);
    console.log("row:", row);

    if (row.length > 0) {
      return res.status(200).json({
        success: true,
        message: `Retrieved all applications`,
        results: row
      });
    } else {
      return res.status(200).json({
        success: true,
        message: `No applications found`,
        results: null
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

exports.getSelectedApp = async (req, res, next) => {
  try {
    const [row, fields] = await connection.query("SELECT * FROM applications WHERE `app_acronym` = ?", req.body.app_acronym);

    console.log("row:", row);

    if (row.length === 1) {
      return res.status(200).json({
        success: true,
        message: `Retrieved application ${req.body.app_acronym}`,
        results: row[0]
      });
    } else {
      throw new Error("Error: Application does not exist");
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

exports.createApp = async (req, res, next) => {
  try {
    console.log("request", req.body);
    checkAcronym(req.body.app_acronym);
    checkRNum(req.body.app_rnumber);

    if (!req.body.app_startdate || !req.body.app_enddate) throw new Error("Error: Start and end dates are mandatory fields");
    if (!req.body.app_permit_create || !req.body.app_permit_open || !req.body.app_permit_todolist || !req.body.app_permit_doing || !req.body.app_permit_done) throw new Error("Error: All permissions are mandatory fields");

    let permits = new Set([req.body.app_permit_create, req.body.app_permit_open, req.body.app_permit_todolist, req.body.app_permit_doing, req.body.app_permit_done]);

    const [row, fields] = await connection.query(`SELECT groupname FROM usergroup WHERE groupname IN (${"?,".repeat(permits.size - 1)} ?);`, [...permits.values()]);

    if (row.length === permits.size) {
      const response = await connection.query(
        `INSERT INTO applications (
          app_acronym, 
          app_description, 
          app_rnumber, 
          app_startdate, 
          app_enddate, 
          app_permit_create, 
          app_permit_open, 
          app_permit_todolist, 
          app_permit_doing, 
          app_permit_done
        ) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?,?); `,
        [req.body.app_acronym, req.body.app_description, req.body.app_rnumber, req.body.app_startdate, req.body.app_enddate, req.body.app_permit_create, req.body.app_permit_open, req.body.app_permit_todolist, req.body.app_permit_doing, req.body.app_permit_done]
      );
      console.log(response);

      return res.status(201).json({
        success: true,
        message: `Application ${req.body.app_acronym} has been created.`
      });
    } else {
      throw new Error("Error: Usergroup for permit does not exist");
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
        message: "Error: Application already exists",
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

exports.updateApp = async (req, res, next) => {
  try {
    console.log("request:", req.body);

    if (!req.body.app_startdate || !req.body.app_enddate) throw new Error("Error: Start and end dates are mandatory fields");
    if (!req.body.app_permit_create || !req.body.app_permit_open || !req.body.app_permit_todolist || !req.body.app_permit_doing || !req.body.app_permit_done) throw new Error("Error: All permissions are mandatory fields");

    let permits = new Set([req.body.app_permit_create, req.body.app_permit_open, req.body.app_permit_todolist, req.body.app_permit_doing, req.body.app_permit_done]);

    const [row, fields] = await connection.query(`SELECT groupname FROM usergroup WHERE groupname IN (${"?,".repeat(permits.size - 1)} ?);`, [...permits.values()]);

    if (row.length === permits.size) {
      const response = await connection.query(
        `UPDATE applications SET 
          app_description = ?, 
          app_startdate = ?, 
          app_enddate = ?, 
          app_permit_create = ?, 
          app_permit_open = ?, 
          app_permit_todolist = ?, 
          app_permit_doing = ?, 
          app_permit_done = ? 
          WHERE app_acronym = ?;`,
        [req.body.app_description, req.body.app_startdate, req.body.app_enddate, req.body.app_permit_create, req.body.app_permit_open, req.body.app_permit_todolist, req.body.app_permit_doing, req.body.app_permit_done, req.body.app_acronym]
      );

      console.log("response", response);
    }

    return res.status(200).json({
      success: true,
      message: `Application ${req.body.app_acronym} has been updated.`
    });
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
