const connection = require("../utils/database");

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

  // const [appAcronymFromDB, field] = await connection.query("SELECT app_acronym FROM applications WHERE app_acronym = ?", appAcronym);
  // console.log(appAcronymFromDB[0].app_acronym);
  // req.body.app_acronym = appAcronymFromDB[0].app_acronym;

  if (row.length === 1) {
    const groupname = Object.values(row[0]);
    return groupname[0];
  } else {
    //if there is no row, app does not exist
    throw new Error("A2");
  }
};
