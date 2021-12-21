const { getAllUser, response } = require("../Helpers/index.helper");

const get = async (req, res) => {
    return response.success(res, { data, message: "req received" });
};

module.exports = {
    get,
};
