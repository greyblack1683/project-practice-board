const connection = require("../utils/database");
const jwt = require("jsonwebtoken");

async function checkGroup(userid, groupName) {
  const [row, fields] = await connection.query("SELECT `groups` FROM accounts WHERE id = ?;", userid);
  console.log(row);
}

exports.isAuthenticated = async (req, res, next) => {
  try {
    let token = req.get("authorization");
    console.log("authorization header:", token);

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];

      if (!token) throw new Error("Invalid token");
    } else {
      throw new Error("Invalid token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const [row, fields] = await connection.query("SELECT `id`, `username`, `email`, `groups`, `active` FROM accounts WHERE id = ?;", decoded.id);
    console.log(row);

    //if there is one user and the id matches with the request
    if (row.length === 1 && row[0].active === "true") {
      //valid user
      req.user = row[0];
      req.isAuthenticated = true;
      next();
    } else {
      throw new Error("Token's user id does not exist or inactive user");
    }
  } catch (error) {
    return res.status(error.message.includes("token") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.isAuthorised = async (...authorisedGroups) => {
  try {
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};
