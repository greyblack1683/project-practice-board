const connection = require("../utils/database");

exports.createGroup = async (req, res, next) => {
  try {
    console.log("request body:", req.body);

    const group = req.body.group;
    if (!group) throw new Error("Group is blank");

    if (group.includes(",")) throw new Error("Group should not contain comma.");

    const response = await connection.query("INSERT INTO `usergroup` VALUES (?);", group);
    console.log("response", response);

    return res.status(200).json({
      success: true,
      message: `Group created`,
      results: { group }
    });
  } catch (error) {
    //sql errors
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error,
        message: "Group already exists",
        stack: error.stack
      });
    }
    return res.status(error.message.includes("Group") ? 400 : 500).json({
      success: false,
      error,
      message: error.message,
      stack: error.stack
    });
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    const [row, fields] = await connection.query("SELECT * FROM `usergroup`");

    console.log("row", row);

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
      throw new Error("Usergroup table cannot be found");
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
