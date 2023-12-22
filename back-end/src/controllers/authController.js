const connection = require("../utils/database");
const jwt = require("jsonwebtoken");

exports.checkGroup = async (userId, groupName) => {
  console.log(groupName);
  const [row, fields] = await connection.query("SELECT `groups` FROM accounts WHERE id = ?;", userId);

  let groupArray = row[0].groups.split(", ");
  console.log(groupArray);

  for (let i = 0; i < groupArray.length; i++) {
    if (groupArray[i] === groupName) return true;
    if (i === groupArray.length - 1) return false;
  }
};

exports.getAuthenticiated = async (req, res, next) => {
  try {
    let token = req.get("authorization");
    console.log("authorization header:", token);

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];

      if (!token) throw new Error("Session expired");
    } else {
      throw new Error("Session expired");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const [row, fields] = await connection.query("SELECT `id`, `username`, `email`, `groups`, `active` FROM accounts WHERE id = ?;", decoded.id);
    console.log(row);

    //if there is one user and the id matches with the request
    if (row.length === 1 && row[0].active === "true") {
      //valid user
      return res.status(200).json({
        success: true,
        message: `Authenticated`
      });
    } else {
      throw new Error("Session user id does not exist or inactive user");
    }
  } catch (error) {
    return res.status(error.message.includes("Session") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.getAuthorised = async (req, res, next) => {
  try {
    console.log("request:", req);
    const response = await this.checkGroup(req.user.id, req.body.authorisedGroup);
    console.log("response: ", response);

    if (response) {
      console.log("response", response);
      res.status(200).json({
        success: true,
        message: "User is authorised"
      });
    } else {
      throw new Error("User is not authorised");
    }
  } catch (error) {
    console.log("error", error);
    return res.status(error.message.includes("User") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};
