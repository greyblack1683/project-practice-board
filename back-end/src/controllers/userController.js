const connection = require("../utils/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function checkPassword(password) {
  if (password.length < 8 && password.length < 10) throw new Error("Error: Password has to be between 8 to 10 characters");
  if (password.search(/[^a-zA-Z0-9]/g) < 0) throw new Error("Error: Password should contain special characters.");
  if (password.search(/[a-zA-Z]/g) < 0) throw new Error("Error: Password should contain letters.");
  if (password.search(/[0-9]/g) < 0) throw new Error("Error: Password should contain numbers.");
}

exports.createUser = async (req, res, next) => {
  try {
    if (!req.body.username) throw new Error("Error: Username is blank");
    // if (req.body.username.length > 45) throw new Error("Error: Username should be not be more than 45 characters.");
    if (!/^[a-zA-Z][a-zA-Z0-9]{0,44}$/g.test(req.body.username)) throw new Error("Error: Username should not be more than 45 characters, should not contain special characters and spaces, and should be alphabets or alphabets with numbers.");
    // if (/^[A-Za-z0-9]*$/.test(req.body.username) === false) throw new Error("Error: Username should be alphabets or alphanumeric.");

    checkPassword(req.body.password);
    const password = await bcrypt.hash(req.body.password, 10);

    let sqlBuilder = "INSERT INTO `accounts` (`username`, `password`, `email`, `isactive`";
    let sqlValuesBuilder = ") VALUES (?,?,?,?";

    results = {
      username: req.body.username,
      password,
      email: req.body.email,
      isactive: req.body.isactive
    };

    if (req.body.groups) {
      results.groups = req.body.groups;
      sqlBuilder = sqlBuilder + ", `groupname`";
      sqlValuesBuilder = sqlValuesBuilder + ", ?";
    }

    sqlBuilder = sqlBuilder + sqlValuesBuilder + ");";

    const response = await connection.query(sqlBuilder, Object.values(results));

    return res.status(201).json({
      success: true,
      message: `User created.`,
      results
    });
  } catch (error) {
    //sql errors
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error,
        message: "Username already exists",
        stack: error.stack
      });
    }

    //not sql error
    return res.status(error.message.includes("Password") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // check username and password
    if (!username || !password) throw new Error("Invalid username or password");

    const [row, fields] = await connection.query("SELECT username, password, isactive FROM accounts WHERE username = ?;", username);

    if (row.length === 1) {
      // valid user -> check password
      const isCorrectPassword = await bcrypt.compare(password, row[0].password);

      if (isCorrectPassword) {
        // valid password and user -> create jwt token
        const token = jwt.sign({ username: row[0].username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

        return res.status(200).json({
          success: true,
          message: `Login successful.`,
          results: {
            username,
            token,
            isactive: row[0].isactive
          }
        });
      } else {
        // invalid password
        throw new Error("Invalid username or password");
      }
    } else {
      // invalid user
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    return res.status(error.message.includes("Invalid username or password") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

//GET all users
//note: to revisit when authen as admin is done
exports.getUsers = async (req, res, next) => {
  try {
    const [row, fields] = await connection.query("SELECT `username`, `email`, `groupname`, `isactive` FROM accounts", null);

    return res.status(200).json({
      success: true,
      message: "Retrieved all users",
      results: row
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

//GET own user
//note: to revisit
exports.getOwnUser = async (req, res, next) => {
  try {
    const [row, fields] = await connection.query("SELECT `username`, `email`, `groupname`, `isactive` FROM accounts WHERE username = ?", req.user.username);

    if (row.length === 1) {
      return res.status(200).json({
        success: true,
        message: `Profile found`,
        results: row[0]
      });
    } else {
      throw new Error("User cannot be found");
    }
  } catch (error) {
    return res.status(error.message.includes("User") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.updateUserforAdmin = async (req, res, next) => {
  try {
    //assumed that isAuthenticated and isAuthorised has already ran

    if (req.body.username == "admin") {
      if (!req.body.groups.includes("admin")) throw new Error("Error: You cannot remove admin usergroup from this account");
      if (req.body.isactive === "false") throw new Error("Error: You cannot disable this account");
    }

    let sqlBuilder = "UPDATE `accounts` SET `email` = ?, `groupname` = ?, `isactive` = ?";

    let results = {
      email: req.body.email,
      groups: req.body.groups,
      isactive: req.body.isactive
    };

    //check for password changes
    if (req.body.password) {
      checkPassword(req.body.password);
      results.password = await bcrypt.hash(req.body.password, 10);
      sqlBuilder = sqlBuilder + ", `password` = ?";
    }

    results.username = req.body.username;

    //update user details
    sqlBuilder = sqlBuilder + " WHERE `username` = ?;";
    const response = await connection.query(sqlBuilder, Object.values(results));

    return res.status(200).json({
      success: true,
      message: "User updated",
      results
    });
  } catch (error) {
    return res.status(error.message.toLowerCase().includes("password") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.updateUserforUser = async (req, res, next) => {
  try {
    let sqlBuilder = "UPDATE `accounts` SET `email` = ?";

    let results = {
      email: req.body.email
    };

    //check for password changes
    if (req.body.password) {
      checkPassword(req.body.password);
      results.password = await bcrypt.hash(req.body.password, 10);
      sqlBuilder = sqlBuilder + ", `password` = ?";
    }

    results.username = req.user.username;

    //update user details
    sqlBuilder = sqlBuilder + " WHERE `username` = ?;";

    const response = await connection.query(sqlBuilder, Object.values(results));

    return res.status(200).json({
      success: true,
      message: "User updated",
      results
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
