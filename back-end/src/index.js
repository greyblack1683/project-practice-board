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
const { isAuthenticated } = require("./middleware/authMiddleware");

// enable API to be access by another domain
app.use(cors());
app.use(jsonParser);

// controllers
const { registerUser, loginUser, getUsers, getOwnUser, createGroup } = require("./controllers/userController");
//const { registerUser, loginUser } = require("./controllers/authController");

// routes
app.post("/users/all", getUsers);
app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/profile/:id", isAuthenticated, getOwnUser);
app.post("/groups/create", isAuthenticated, createGroup);

// app listening on port
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port} in ${process.env.NODE_ENV}`);
});
