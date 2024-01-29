const express = require("express");

/* External Middlewares */
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json(); // create application/json parser

/* Start a server */
const app = express();

/* Middlewares - Implementation */
const { isAuthenticated, isPermitted } = require("./middleware/authMiddleware");
const { isValidPayload } = require("./middleware/payloadMiddleware");

// whitelist for specific domains to be able to access this API
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin !== -1)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
  })
);
app.use(jsonParser); // read JSON req body

/* Controllers */

const { GetTaskByState, CreateTask, PromoteTask2Done } = require("./controllers/taskController");

/* Routes */

app.post("/GetTaskByState", isValidPayload("task_status", "task_app_acronym"), isAuthenticated, GetTaskByState);
app.post("/CreateTask", isValidPayload("task_app_acronym", "task_name"), isAuthenticated, isPermitted("create"), CreateTask);
app.post("/PromoteTask2Done", isValidPayload("task_id"), isAuthenticated, isPermitted("doing"), PromoteTask2Done);

app.all("*", (req, res, next) => {
  res.status(404).json({
    code: "V1"
  });
});

/* Listen on Port */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port} in ${process.env.NODE_ENV}`);
});
