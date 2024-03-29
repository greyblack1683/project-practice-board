const connection = require("../utils/database");
const jwt = require("jsonwebtoken");

exports.Checkgroup = async (userid, groupName) => {
  console.log(`Checking if ${userid} is in ${groupName}`);

  const [row, fields] = await connection.query("SELECT `groupname` FROM accounts WHERE `username` = ?;", userid);

  if (row.length === 0) return false;

  let groupArray = row[0].groupname.split(", ");
  console.log(groupArray);

  for (let i = 0; i < groupArray.length; i++) {
    console.log(groupArray[i], groupName);
    if (groupArray[i] === groupName) return true;
    if (i === groupArray.length - 1) return false;
  }
};

exports.checkToken = async token => {
  console.log(`Checking if token is valid`);
  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];

    if (!token) throw new Error("Error: Session expired");
  } else {
    throw new Error("Error: Session expired");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);

  const [row, fields] = await connection.query("SELECT `username`, `email`, `groupname`, `isactive` FROM accounts WHERE `username` = ?;", decoded.username);
  console.log(row);

  return row;
};

exports.checkPermits = async (permit, appAcronym) => {
  console.log(`Getting usergroup with ${permit} for the application ${appAcronym}`);
  let sqlBuilder = "SELECT ";
  switch (permit) {
    case "create":
      sqlBuilder = sqlBuilder + `app_permit_create`;
      break;
    case "open":
      sqlBuilder = sqlBuilder + `app_permit_open`;
      break;
    case "todo":
      sqlBuilder = sqlBuilder + `app_permit_todolist`;
      break;
    case "doing":
      sqlBuilder = sqlBuilder + `app_permit_doing`;
      break;
    case "done":
      sqlBuilder = sqlBuilder + `app_permit_done`;
      break;
    default:
      throw new Error("Error: Error in request body");
  }

  sqlBuilder = sqlBuilder + ` FROM applications WHERE app_acronym = ?`;

  //check for the usergroup that has the right permission
  const [row, fields] = await connection.query(sqlBuilder, appAcronym);

  console.log(row);

  if (row.length === 1) {
    const groupname = Object.values(row[0]);
    return groupname[0];
  } else {
    throw new Error("Error: There is no group defined for the permission requested for this application");
  }
};

exports.getAuthenticiated = async (req, res, next) => {
  try {
    let token = req.get("authorization");

    const row = await this.checkToken(token);

    //if there is one user and the username matches with the request
    if (row.length === 1 && row[0].isactive === "true") {
      //valid user
      return res.status(200).json({
        success: true,
        message: `Authenticated`
      });
    } else {
      throw new Error("Error: Session user username does not exist or inactive user");
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

exports.getAuthorised = async (req, res, next) => {
  try {
    // let grouping = req.body.authorisedGroup;
    // if (grouping.includes(",")) grouping = grouping.split(",");
    // if (Array.isArray(grouping)) {
    //   let results = {};
    //   for (let i = 0; i < grouping.length; i++) {
    //     const response = await this.Checkgroup(req.user.username, grouping[i].trim());
    //     results[grouping[i].trim()] = response;
    //   }
    //   return res.status(200).json({
    //     success: true,
    //     results
    //   });
    // } else {
    const response = await this.Checkgroup(req.user.username, req.body.authorisedGroup);

    return res.status(200).json({
      success: response,
      message: response ? "User is authorised" : "User is not authorised"
    });
    // }
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.getAuthorisedforPlansnTasks = async (req, res, next) => {
  try {
    console.log(req.body);

    const groupname = await this.checkPermits(req.body.permitFor, req.body.app_acronym);
    console.log("checkpermit:", groupname);
    const response = await this.Checkgroup(req.user.username, groupname);
    console.log("checkgroup:", response);
    return res.status(200).json({
      success: response,
      message: response ? "User is authorised" : "User is not authorised"
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};
