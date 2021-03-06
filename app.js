const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();

const { authRoute, users } = require("./Routes");
const { ReqLogger } = require("./Middleware");

const app = express();

app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(mongoSanitize());
app.use(ReqLogger);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", users);

module.exports = app;
