const connection = require("../utils/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function checkPassword(password) {
  if (password.length < 8 && password.length < 10) throw new Error("Password has to be between 8 to 10 characters");
  if (password.search(/[^a-zA-Z0-9]/g) < 0) throw new Error("Password should contain special characters.");
  if (password.search(/[a-zA-Z]/g) < 0) throw new Error("Password should contain letters.");
  if (password.search(/[0-9]/g) < 0) throw new Error("Password should contain numbers.");
}

exports.createUser = async (req, res, next) => {
  try {
    console.log("request body:", req.body);

    checkPassword(req.body.password);
    const password = await bcrypt.hash(req.body.password, 10);

    results = {
      username: req.body.username,
      password,
      email: req.body.email,
      groups: req.body.groups ? req.body.groups : "user"
    };

    const response = await connection.query("INSERT INTO `accounts` (`username`, `password`, `email`, `groups`) VALUES (?,?,?,?);", Object.values(results));
    console.log(response);

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
    console.log("request body:", req.body);

    const { username, password } = req.body;

    // check username and password
    if (!username || !password) throw new Error("Invalid username or password");

    const [row, fields] = await connection.query("SELECT id, password FROM accounts WHERE username = ?;", username);

    if (row.length === 1) {
      // valid user -> check password
      const isCorrectPassword = await bcrypt.compare(password, row[0].password);

      if (isCorrectPassword) {
        // valid password and user -> create jwt token
        const token = jwt.sign({ id: row[0].id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

        return res.status(200).json({
          success: true,
          message: `Login successful.`,
          results: {
            id: row[0].id,
            username,
            token
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
    const [row, fields] = await connection.query("SELECT `id`, `username`, `email`, `groups`, `active` FROM accounts", null);
    console.log("row:", row);

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
    console.log("request body:", req.user);

    const [row, fields] = await connection.query("SELECT `id`, `username`, `email`, `groups`, `active` FROM accounts WHERE id = ?", req.user.id);
    console.log("row", row);

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
    console.log("request body:", req.body);

    let sqlBuilder = "UPDATE `accounts` SET `email` = ?, `groups` = ?, `active` = ?";

    let results = {
      email: req.body.email,
      groups: req.body.groups,
      active: req.body.active
    };

    //check for password changes
    if (req.body.password) {
      checkPassword(req.body.password);
      results.password = await bcrypt.hash(req.body.password, 10);
      sqlBuilder = sqlBuilder + ", `password` = ?";
    }

    results.id = req.body.id;

    //update user details
    sqlBuilder = sqlBuilder + " WHERE `id` = ?;";
    console.log(sqlBuilder);
    const response = await connection.query(sqlBuilder, Object.values(results));
    console.log("response", response);

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
    console.log("request body:", req.body);

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

    results.id = req.user.id;

    //update user details
    sqlBuilder = sqlBuilder + " WHERE `id` = ?;";
    console.log(sqlBuilder);
    const response = await connection.query(sqlBuilder, Object.values(results));
    console.log("response", response);

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
