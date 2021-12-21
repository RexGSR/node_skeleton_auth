const { logger } = require("../Helpers/index.helper");

function reqLogger(req, res, next) {
    const currentDateTime = new Date();
    const formattedDate = `${currentDateTime.getFullYear()
    }-${
        currentDateTime.getMonth() + 1
    }-${
        currentDateTime.getDate()
    } ${
        currentDateTime.getHours()
    }:${
        currentDateTime.getMinutes()
    }:${
        currentDateTime.getSeconds()}`;

    const ip = req.headers["x-forwarded-for"]
     || req.connection.remoteAddress
     || req.socket.remoteAddress
     || req.connection.socket.remoteAddress;

    const { method, url, statusCode } = req;
    const log = `Request: [${formattedDate}] ${method}:${url} ${statusCode || ""} ${ip}`;
    logger.info(log);
    next();
}

module.exports = reqLogger;
