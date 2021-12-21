const { response } = require("../Helpers/index.helper");

// ? catching validation errors
function reqError(error, req, res, next) {
    if (!error) { next(); }

    const data = {
        status: error.status,
        data: [{
            errorCode: error.status,
            message: error.message,
        }],
    };

    response.badRequest(res, data);
}

module.exports = reqError;
