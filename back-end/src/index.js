const express = require("express");

/* External Middlewares */
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json(); // create application/json parser

/* Start a server */
const app = express();

/* Middlewares - Implementation */
const { isAuthenticated, isAuthorised, isPermitted } = require("./middleware/authMiddleware");

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
const { createUser, loginUser, getUsers, getOwnUser, updateUserforAdmin, updateUserforUser } = require("./controllers/userController");
const { getAuthenticiated, getAuthorised, getAuthorisedforPlansnTasks } = require("./controllers/authController");
const { createGroup, getGroups } = require("./controllers/groupController");
const { getApps, getSelectedApp, createApp, updateApp } = require("./controllers/appController");
const { getPlansOfApp, getSelectedPlan, createPlan, updatePlan } = require("./controllers/planController");
const { getTasksOfApp, getSelectedTask, createTask, updateOpenTask, updateToDoTask, updateDoingTask, updateDoneTask } = require("./controllers/taskController");

/* Routes */
app.get("/users/all", isAuthenticated, isAuthorised("admin"), getUsers);
app.post("/users/create", isAuthenticated, isAuthorised("admin"), createUser);
app.post("/users/update", isAuthenticated, isAuthorised("admin"), updateUserforAdmin);

app.post("/login", loginUser);
app.get("/authenticate", getAuthenticiated);
app.post("/authorize", isAuthenticated, getAuthorised);
app.post("/checkpermissions", isAuthenticated, getAuthorisedforPlansnTasks);

app.get("/groups/all", isAuthenticated, isAuthorised("admin", "projectlead"), getGroups);
app.post("/groups/create", isAuthenticated, isAuthorised("admin"), createGroup);

app.get("/profile", isAuthenticated, getOwnUser);
app.post("/profile/update", isAuthenticated, updateUserforUser);

app.get("/apps/all", isAuthenticated, getApps);
app.post("/apps/selected", isAuthenticated, getSelectedApp);
app.post("/apps/create", isAuthenticated, isAuthorised("projectlead"), createApp);
app.post("/apps/update", isAuthenticated, isAuthorised("projectlead"), updateApp);

// app.get("/plans/all", isAuthenticated, getPlans);
app.post("/plans/forapp", isAuthenticated, getPlansOfApp);
app.post("/plans/selected", isAuthenticated, getSelectedPlan);
app.post("/plans/create", isAuthenticated, isPermitted("open"), createPlan);
app.post("/plans/update", isAuthenticated, isPermitted("open"), updatePlan);

app.post("/tasks/forapp", isAuthenticated, getTasksOfApp);
app.post("/tasks/selected", isAuthenticated, getSelectedTask);
app.post("/tasks/create", isAuthenticated, isPermitted("create"), createTask);
app.post("/tasks/updateOpen", isAuthenticated, isPermitted("open"), updateOpenTask);
app.post("/tasks/updateTodo", isAuthenticated, isPermitted("todo"), updateToDoTask);
app.post("/tasks/updateDoing", isAuthenticated, isPermitted("doing"), updateDoingTask);
app.post("/tasks/updateDone", isAuthenticated, isPermitted("done"), updateDoneTask);

app.all("*", (req, res, next) => {
  res.status(500).json({
    success: false,
    message: `${req.originalUrl} not found`
  });
});

/* Listen on Port */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port} in ${process.env.NODE_ENV}`);
});
