const app = require("./app");
const { logger } = require("./Helpers/index.helper");
const { connection } = require("./Database/connections");

app.listen(process.env.PORT, async (error) => {
    if (error) {
        logger.error(error);
        process.exit(1);
    }
    try {
        await connection();
        logger.info("connected to the database");
    } catch (connectionError) {
        logger.error("database connection error");
        logger.error(connectionError);
    }

    logger.info(`Server started on: http://localhost:${process.env.PORT}`);
});
