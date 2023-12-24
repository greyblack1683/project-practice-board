const express = require("express");

//middlewares
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// create application/json parser
var jsonParser = bodyParser.json();

/* Middlewares*/
const { isAuthenticated, isAuthorised } = require("./middleware/authMiddleware");

// enable API to be access by another domain
app.use(cors());
app.use(jsonParser);

// controllers
const { createUser, loginUser, getUsers, getOwnUser, createGroup, updateUserforAdmin, updateUserforUser } = require("./controllers/userController");
const { getAuthenticiated, getAuthorised } = require("./controllers/authController");

// routes
app.post("/users/create", createUser);
app.get("/users/all", isAuthenticated, isAuthorised("admin"), getUsers);
app.post("/users/update", isAuthenticated, isAuthorised("admin"), updateUserforAdmin);

app.post("/login", loginUser);
app.get("/authenticate", getAuthenticiated);
app.post("/authorize", isAuthenticated, getAuthorised);
app.post("/groups/create", isAuthenticated, isAuthorised("admin"), createGroup);

//may need to change
app.get("/profile", isAuthenticated, getOwnUser);
app.post("/profile/update", isAuthenticated, updateUserforUser);

app.all("*", (req, res, next) => {
  res.status(500).json({
    success: false,
    message: `${req.originalUrl} not found`
  });
});

// app listening on port
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port} in ${process.env.NODE_ENV}`);
});
