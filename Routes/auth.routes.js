const express = require("express");
const { register, login, generateTokens } = require("../Controllers");
const { Validator } = require("../Middleware");

const router = express.Router();

router.get("/", generateTokens)
    .post("/login", Validator("loginValidator"), login)
    .post("/register", Validator("registerValidator"), register);

module.exports = router;
