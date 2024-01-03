const express = require("express");

/* External Middlewares */
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json(); // create application/json parser

/* Start a server */
const app = express();

/* Middlewares - Implementation */
const { isAuthenticated, isAuthorised } = require("./middleware/authMiddleware");

// whitelist for specific domains to be able to access this API
const whitelist = ["http://stengg.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin !== -1)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
app.use(cors(corsOptions));
app.use(jsonParser); // read JSON req body

/* Controllers */
const { createUser, loginUser, getUsers, getOwnUser, updateUserforAdmin, updateUserforUser } = require("./controllers/userController");
const { getAuthenticiated, getAuthorised } = require("./controllers/authController");
const { createGroup, getGroups } = require("./controllers/groupController");

/* Routes */
app.get("/users/all", isAuthenticated, isAuthorised("admin"), getUsers);
app.post("/users/create", isAuthenticated, isAuthorised("admin"), createUser);
app.post("/users/update", isAuthenticated, isAuthorised("admin"), updateUserforAdmin);

app.post("/login", loginUser);
app.get("/authenticate", getAuthenticiated);
app.post("/authorize", isAuthenticated, getAuthorised);

app.get("/groups/all", isAuthenticated, isAuthorised("admin"), getGroups);
app.post("/groups/create", isAuthenticated, isAuthorised("admin"), createGroup);

app.get("/profile", isAuthenticated, getOwnUser);
app.post("/profile/update", isAuthenticated, updateUserforUser);

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
