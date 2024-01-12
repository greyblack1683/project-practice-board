const { Checkgroup, checkToken } = require("../controllers/authController");

exports.isAuthenticated = async (req, res, next) => {
  try {
    let token = req.get("authorization");

    const row = await checkToken(token);

    // if there is one user and the username matches with the request
    if (row.length === 1) {
      // valid user
      if (row[0].isactive === "true") {
        // active user
        req.user = row[0];
        //req.isAuthenticated = true;
      } else {
        // inactive user
        throw new Error("Error: Inactive user");
      }
    } else {
      throw new Error("Error: User does not exist");
    }
    next();
  } catch (error) {
    return res.status(error.message.includes("Error") || error.message.toLowerCase().includes("user") ? 400 : 500).json({
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
        response = await Checkgroup(req.user.username, authorisedGroup[i]);
        // if user has one of the authorised group
        if (response) return next();
        if (i === authorisedGroup.length - 1) {
          // if user does not have any of the authorised group
          throw new Error("User is not authorised");
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
