const connection = require("../utils/database");
const bcrypt = require("bcryptjs");
const { Checkgroup, checkPermits } = require("../controllers/authController");

exports.isAuthenticated = async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;

    // check username and password
    if (!username || !password) throw new Error("Invalid username or password");

    const [row, fields] = await connection.query("SELECT username, password, isactive FROM accounts WHERE username = ?;", username);

    if (row.length === 1 && row[0].isactive === "true") {
      // valid and active user -> check password
      const isCorrectPassword = await bcrypt.compare(password, row[0].password);

      if (isCorrectPassword) {
        // valid password and user
        req.user = row[0];
      } else {
        // invalid password
        throw new Error("A1");
      }
    } else {
      // invalid user
      throw new Error("A1");
    }
    next();
  } catch (error) {
    return res.status(400).json({
      code: error.message
    });
  }
};

// exports.isAuthorised = (...authorisedGroup) => {
//   return async (req, res, next) => {
//     try {
//       let response;
//       for (let i = 0; i < authorisedGroup.length; i++) {
//         response = await Checkgroup(req.user.username, authorisedGroup[i]);
//         // if user has one of the authorised group
//         if (response) return next();
//         if (i === authorisedGroup.length - 1) {
//           // if user does not have any of the authorised group
//           throw new Error("User is not authorised");
//         }
//       }
//     } catch (error) {
//       return res.status(error.message.includes("Error") ? 400 : 500).json({
//         success: false,
//         error,
//         message: error.message,
//         stack: error.stack
//       });
//     }
//   };
// };

exports.isPermitted = (...permittedGroup) => {
  return async (req, res, next) => {
    console.log(req.body.task_app_acronym);
    if (!req.body.task_app_acronym) {
      req.body.task_app_acronym = req.body.task_id.split("_")[0];
    }
    try {
      let response;

      for (let i = 0; i < permittedGroup.length; i++) {
        const groupname = await checkPermits(permittedGroup[i], req.body.task_app_acronym);
        response = await Checkgroup(req.user.username, groupname);
        //if user has one of the permitted group
        if (response) return next();
        if (i === permittedGroup.length - 1) {
          //if user does not have any of the permitted group
          throw new Error("User is not authorised");
        }
      }
    } catch (error) {
      if (error.message === "A2") {
        return res.status(400).json({
          code: error.message
        });
      }
      return res.status(400).json({
        code: "A3"
      });
    }
  };
};
