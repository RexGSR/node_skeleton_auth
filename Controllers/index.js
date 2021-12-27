const { register, login, generateTokens } = require("./auth.controller");
const { getUsers } = require("./user.controller");

module.exports = {
    register,
    login,
    getUsers,
    generateTokens,
};
