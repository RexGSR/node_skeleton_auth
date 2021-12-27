const { response } = require("../Helpers");

const getUsers = async (req, res) => response.success(res, { message: "req received" });

module.exports = {
    getUsers,
};
