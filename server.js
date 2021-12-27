const app = require("./app");
const { logger } = require("./Helpers");
const { connection } = require("./Database");

const { PORT } = process.env;

app.listen(PORT, async (error) => {
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

    logger.info(`Server started on: http://localhost:${PORT}`);
});
