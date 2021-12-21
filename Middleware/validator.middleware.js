const Validators = require("../Validators/index.validator");
const { response } = require("../Helpers/index.helper");

module.exports = (validator) => {
    // ? verifying if the validator exists
    // eslint-disable-next-line no-prototype-builtins
    if (!Validators.hasOwnProperty(validator)) {
        throw new Error(`${validator} does not exist`);
    }

    // eslint-disable-next-line consistent-return
    return async (req, res, next) => {
        try {
            const validate = await Validators[validator].validateAsync(req.body);
            req.body = validate;
            next();
        } catch (error) {
            // eslint-disable-next-line max-len
            if (error.isJoi) { return response.error(res, { status: 422, message: error.message }); }
            return response.error(res, { status: 500, message: error.message });
        }
    };
};
