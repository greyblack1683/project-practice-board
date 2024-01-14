const connection = require("../utils/database");

exports.getPlans = async (req, res, next) => {
  try {
    const [row, fields] = await connection.query("SELECT * FROM plans;", null);
    console.log("row:", row);

    if (row.length > 0) {
      return res.status(200).json({
        success: true,
        message: `Retrieved all plans`,
        results: row
      });
    } else {
      return res.status(200).json({
        success: true,
        message: `There are no plans`
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

exports.getPlansOfApp = async (req, res, next) => {
  try {
    const [row, fields] = await connection.query("SELECT * FROM plans WHERE `plan_app_acronym` = ?;", req.body.plan_app_acronym);
    console.log("row:", row);

    if (row.length > 0) {
      return res.status(200).json({
        success: true,
        message: `Retrieved all plans`,
        results: row
      });
    } else {
      return res.status(200).json({
        success: true,
        message: `There are no plans`
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

exports.createPlan = async (req, res, next) => {
  try {
    console.log("request:", req.body);
    //need to check startdate is before enddate in frontend
    if (!req.body.plan_startdate || !req.body.plan_enddate) throw new Error("Error: Start and end dates are mandatory fields");
    const response = await connection.query("INSERT INTO plans VALUES (?,?,?,?);", [req.body.plan_mvp_name, req.body.plan_startdate, req.body.plan_enddate, req.body.plan_app_acronym]);

    return res.status(200).json({
      success: true,
      message: `Plan ${req.body.plan_mvp_name} has been created`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    console.log("request:", req.body);
    //need to check startdate is before enddate in frontend
    const response = await connection.query("UPDATE `plans` SET `plan_startdate` = ?, `plan_enddate` = ? WHERE `plan_mvp_name` = ? AND `plan_app_acronym` = ?;", [req.body.plan_startdate, req.body.plan_enddate, req.body.plan_mvp_name, req.body.plan_app_acronym]);
    return res.status(200).json({
      success: true,
      message: `Plan ${req.body.plan_mvp_name} has been updated`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};
