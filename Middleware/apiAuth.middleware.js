const { response } = require("../Helpers/index.helper");
const { logger, verifyToken, extractToken } = require("../Helpers/index.helper");

function authorize(authRoles) {
    const roles = ["admin", "superAdmin", "user"];

    // eslint-disable-next-line consistent-return
    return async (req, res, next) => {
        const { role: reqUserRole } = req.body.role;
        logger.info(roles.filter((role) => {
            const match = authRoles.filter((authRole) => authRole === role);
            return match[0];
        }));
        const acceptedRole = authRoles.filter((role) => role === reqUserRole);
        if (acceptedRole.length !== 1) return response.unauthorized(res, {});
        next();
    };
}

// eslint-disable-next-line consistent-return
async function authJwt(req, res, next) {
    const token = extractToken(req);
    const verify = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    if (verify === "TokenExpiredError") return response.unauthorized(res, { message: "access token expired" });
    if (!verify && (typeof verify === "boolean")) return response.unauthorized(res, {});
    req.body.id = verify?.id;
    req.body.role = verify?.role;
    next();
}

module.exports = {
    authorize,
    authJwt,
};
