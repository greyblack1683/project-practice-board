const connection = require("../utils/database");
const jwt = require("jsonwebtoken");

exports.checkGroup = async (userId, groupName) => {
  console.log(`Checking if ${userId} is in ${groupName}`);

  const [row, fields] = await connection.query("SELECT `groups` FROM accounts WHERE id = ?;", userId);

  if (row.length === 0) return false;

  let groupArray = row[0].groups.split(", ");
  console.log(groupArray);

  for (let i = 0; i < groupArray.length; i++) {
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

  const [row, fields] = await connection.query("SELECT `id`, `username`, `email`, `groups`, `active` FROM accounts WHERE id = ?;", decoded.id);
  console.log(row);

  return row;
};

exports.getAuthenticiated = async (req, res, next) => {
  try {
    let token = req.get("authorization");

    const row = await this.checkToken(token);

    //if there is one user and the id matches with the request
    if (row.length === 1 && row[0].active === "true") {
      //valid user
      return res.status(200).json({
        success: true,
        message: `Authenticated`
      });
    } else {
      throw new Error("Error: Session user id does not exist or inactive user");
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
    const response = await this.checkGroup(req.user.id, req.body.authorisedGroup);

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
