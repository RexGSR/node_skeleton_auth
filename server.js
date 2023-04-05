const { createServer } = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const { connection } = require("./Database/connection");
const Logger = require("./Helpers/logger");
const { IST } = require("./Helpers/dateTime.helper");
const HandleError = require('./Middleware/errorHandler.middleware');


const server = createServer(app);

const { PORT, NODE_ENV } = process.env;

const httpServer = server.listen(PORT || 9081, '0.0.0.0', async (error) => {
    // Logger.info(`Server started connection on port ${PORT || 9081}`);
    if (error) {
        Logger.error(error);
        process.exit(1);
    }
    try {
        await connection();
        console.log(`server started on port: [${PORT || 9081}] with [${(NODE_ENV).toUpperCase()} --env] [${IST("date")} ${IST('time')}]`);
    } catch (connectionError) {
        console.log("Unable to connect --DATABASE, Killing app :(");
        Logger.error(connectionError?.stack);
        process.exit(1);
    }
});


const io = new Server(httpServer, {
    maxHttpBufferSize: 1024,
    pingInterval: 60 * 1000,
    pingTimeout: 60 * 4000,
    cors: {
        origins: process.env.CORS_URLS.split(", "),
    },
});

require("./Controllers/socket.controller")(io);

//? routes
require("./Routes")();

//? error handler middleware
app.use(HandleError);

//? setting socket io as global
global.io = io;