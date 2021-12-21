const express = require("express");
const { register, login, generateTokens } = require("../Controllers/index.controller");
const { Validator } = require("../Middleware/index.middleware");

const router = express.Router();

router.get("/", generateTokens)
    .post("/login", Validator("loginValidator"), login)
    .post("/register", Validator("registerValidator"), register);

module.exports = router;
