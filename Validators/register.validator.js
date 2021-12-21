const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string().min(3).required().min(3).max(25),
    email: Joi.string().required().lowercase().email(),
    password: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
});

module.exports = registerSchema;
