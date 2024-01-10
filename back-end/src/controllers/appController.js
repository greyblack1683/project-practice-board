const connection = require("../utils/database");

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
      throw new Error("Error: Failed to receive SQL response");
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
    let permits = new Set([req.body.app_permit_create, req.body.app_permit_open, req.body.app_permit_todolist, req.body.app_permit_doing, req.body.app_permit_done]);

    const [row, fields] = await connection.query(`SELECT groupname FROM usergroup WHERE groupname IN (${"?,".repeat(permits.size - 1)} ?);`, [...permits.values()]);

    if (row.length === permits.size) {
      //need to check startdate is before enddate in frontend
      let sqlBuilder = "INSERT INTO `applications` (`app_acronym`, `app_startdate`, `app_enddate`, `app_permit_create`, `app_permit_open`, `app_permit_todolist`, `app_permit_doing`, `app_permit_done`";
      let sqlBuilderEnd = ") VALUES (?, ?, ?, ?, ?, ?, ?, ?";
      let sqlValues = [req.body.app_acronym, req.body.app_startdate, req.body.app_enddate, req.body.app_permit_create, req.body.app_permit_open, req.body.app_permit_todolist, req.body.app_permit_doing, req.body.app_permit_done];
      if (req.body.app_description !== null) {
        sqlBuilder = sqlBuilder + ", `app_description`";
        sqlBuilderEnd = sqlBuilderEnd + ", ?";
        sqlValues.push(req.body.app_description);
      }
      sqlBuilder = sqlBuilder + sqlBuilderEnd + ");";
      const response = await connection.query(sqlBuilder, sqlValues);
      console.log(response);

      return res.status(201).json({
        success: true,
        message: `Application ${req.body.app_acronym} has been created.`
      });
    } else {
      throw new Error("Error: Usergroup for permit does not exist");
    }
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error,
        message: "Application already exists",
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

    //need to check startdate is before enddate in frontend
    const response = await connection.query("UPDATE `applications` SET `app_description` = ?, `app_startdate` = ?, `app_enddate` = ?, `app_permit_create` = ?, `app_permit_open` = ?, `app_permit_todolist` = ?, `app_permit_doing` = ?, `app_permit_done` = ? WHERE `app_acronym` = ?;", [req.body.app_description, req.body.app_startdate, req.body.app_enddate, req.body.app_permit_create, req.body.app_permit_open, req.body.app_permit_todolist, req.body.app_permit_doing, req.body.app_permit_done, req.body.app_acronym]);

    console.log("response", response);

    return res.status(200).json({
      success: true,
      message: `Application ${req.body.app_acronym} has been updated.`
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
