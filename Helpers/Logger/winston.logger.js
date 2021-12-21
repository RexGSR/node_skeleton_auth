const dayjs = require("dayjs");

// eslint-disable-next-line import/no-extraneous-dependencies
const { createLogger, format, transports } = require("winston");

const { combine, timestamp, printf } = format;

// eslint-disable-next-line no-shadow
const myFormat = printf(({ level, message, timestamp }) => `${dayjs().format(timestamp)}  [${level.toUpperCase()}]: ${message}`);

const log = createLogger({
    format: combine(

        timestamp(),
        myFormat,

    ),
    transports: [
        new transports.Console(),
    ],
});

module.exports = log;
