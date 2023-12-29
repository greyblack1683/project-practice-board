const connection = require("../utils/database");

exports.createGroup = async (req, res, next) => {
  try {
    const group = req.body.group;
    console.log(`Creating group with group name: ${group}`);
    if (!group) throw new Error("Error: Group is blank");

    if (group.includes(",")) throw new Error("Error: Group should not contain comma.");

    const response = await connection.query("INSERT INTO `usergroup` VALUES (?);", group);

    return res.status(200).json({
      success: true,
      message: `Group created`,
      results: { group }
    });
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
