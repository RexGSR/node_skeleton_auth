const express = require("express");
const { getUsers } = require("../Controllers");
const { authorize, authJwt } = require("../Middleware");

const router = express.Router();

router.get("/", authJwt, authorize(["admin", "superAdmin"]), getUsers);

module.exports = router;
