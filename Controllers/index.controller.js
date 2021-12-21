const { register, login, generateTokens } = require("./auth.controller");
const { get: getUsers } = require("./user.controller");

module.exports = {
    register,
    login,
    getUsers,
    generateTokens,
};
