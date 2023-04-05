const authRoute = require("./auth.routes");
const app = require("../app");

//! always remove /api before pushing to server
function appRouter() {
    app.use("/api/v1/auth", authRoute);
}

module.exports = appRouter;
