const connection = require("../utils/database");

function checkPlanName(planName) {
  if (!planName) throw new Error("Error: Plan Name should not be blank");
  if (planName > 45) throw new Error("Error: Plan Name should be not be more than 45 characters.");
  if (planName.search(/[^a-zA-Z0-9]/g) > 0) throw new Error("Error: Plan Name should not contain special characters and spaces.");
  if (/^[A-Za-z0-9]*$/.test(planName) === false) throw new Error("Error: Plan Name should be alphabets or alphanumeric.");
}

// exports.getPlans = async (req, res, next) => {
//   try {
//     const [row, fields] = await connection.query("SELECT * FROM plans;", null);
//     console.log("row:", row);

//     if (row.length > 0) {
//       return res.status(200).json({
//         success: true,
//         message: `Retrieved all plans`,
//         results: row
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         message: `There are no plans`
//       });
//     }
//   } catch (error) {
//     return res.status(error.message.includes("Error") ? 400 : 500).json({
//       success: false,
//       error,
//       message: error.message,
//       stack: error.stack
//     });
//   }
// };

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

exports.getSelectedPlan = async (req, res, next) => {
  try {
    console.log("request:", req.body);
    const [row, fields] = await connection.query("SELECT * FROM plans WHERE plan_app_acronym = ? AND plan_mvp_name = ?", [req.body.plan_app_acronym, req.body.plan_mvp_name]);

    if (row.length === 1) {
      return res.status(200).json({
        success: true,
        message: `Retrieved plan ${req.body.plan_mvp_name}`,
        results: row[0]
      });
    } else {
      throw new Error(`Error: Plan ${req.body.plan_mvp_name} of application ${req.body.plan_app_acronym} does not exist.`);
    }
  } catch (error) {
    return res.status(500).json({
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
    checkPlanName(req.body.plan_mvp_name);
    if (!req.body.plan_startdate || !req.body.plan_enddate) throw new Error("Error: Start and end dates are mandatory fields");

    const response = await connection.query("INSERT INTO plans VALUES (?,?,?,?);", [req.body.plan_mvp_name, req.body.plan_startdate, req.body.plan_enddate, req.body.plan_app_acronym]);

    return res.status(201).json({
      success: true,
      message: `Plan ${req.body.plan_mvp_name} has been created`
    });
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error,
        message: "Error: Plan already exists",
        stack: error.stack
      });
    }
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
    if (!req.body.plan_startdate || !req.body.plan_enddate) throw new Error("Error: Start and end dates are mandatory fields");
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
