const mongoose = require("mongoose");

module.exports = {
    connection: () => mongoose.connect(process.env.DATABASE_URI),
};
