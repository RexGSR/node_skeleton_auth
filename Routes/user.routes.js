const express = require("express");
const { getUsers } = require("../Controllers/index.controller");
const { authorize, authJwt } = require("../Middleware/index.middleware");

const router = express.Router();

router.get("/", authJwt, authorize(["admin", "superAdmin"]), getUsers);

module.exports = router;
