const connection = require("../utils/database");
const jwt = require("jsonwebtoken");

const { checkGroup } = require("../controllers/authController");

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
    } else {
      throw new Error("Token's user id does not exist or inactive user");
    }
    next();
  } catch (error) {
    return res.status(error.message.includes("token") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.isAuthorised = (...authorisedGroup) => {
  return async (req, res, next) => {
    try {
      let response;
      for (let i = 0; i < authorisedGroup.length; i++) {
        response = await checkGroup(req.user.id, authorisedGroup[i]);
        // if user has one of the authorised group
        if (response) return next();
        if (i === authorisedGroup.length - 1) {
          // if user does not have any of the authorised group
          throw new Error("Error: User is not authorised");
        }
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
};
