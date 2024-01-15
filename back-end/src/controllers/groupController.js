const connection = require("../utils/database");

exports.createGroup = async (req, res, next) => {
  try {
    const group = req.body.group;
    console.log(`Creating group with group name: ${group}`);
    if (!group) throw new Error("Error: Group is blank");
    if (group.length > 45) throw new Error("Error: Group should be not be more than 45 characters.");
    if (group.search(/[^a-zA-Z0-9]/g) > 0) throw new Error("Error: Group should not contain special characters and spaces.");
    if (/^[A-Za-z0-9]*$/.test(group) === false) throw new Error("Error: Group should be alphabets or alphanumeric.");

    const response = await connection.query("INSERT INTO `usergroup` VALUES (?);", group);

    if (response) {
      return res.status(200).json({
        success: true,
        message: `Group created`,
        results: { group }
      });
    } else {
      throw new Error("Error: Failed to receive SQL response");
    }
  } catch (error) {
    //sql duplicate errors
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error,
        message: "Error: Group already exists",
        stack: error.stack
      });
    }
    return res.status(error.message.includes("Error") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    console.log("Getting all groups");
    const [row, fields] = await connection.query("SELECT * FROM `usergroup`");

    if (row.length > 0) {
      let results = [];
      row.forEach(item => {
        results.push(item.groupname);
      });
      return res.status(200).json({
        success: true,
        message: `Usergroup found`,
        results
      });
    } else {
      throw new Error("Error: Usergroup table cannot be found");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};
