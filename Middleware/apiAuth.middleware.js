const Response = require("../Helpers/response.helper");
const { verifyToken, extractToken } = require("../Helpers/auth.helper");
const DB = require("../Helpers/crud.helper");

const Role = require("../Database/Models/role.model");

function authorize(authRoles) {
    return async (req, res, next) => {
        const roles = await DB.read(Role, { _id: { $in: (req.query.user_role).split(',') } });
        if (roles.length && authRoles.length) {
            let rolesArray = roles.map((item) => item.role);
            let grantAcccess = false;
            let i = 0;
            let length = rolesArray.length;
            for (i; i < length; i++) {
                if (authRoles.includes(rolesArray[i])) {
                    grantAcccess = true;
                    // req.query.auth_role = rolesArray.join(',');
                    req.query.auth_role = rolesArray;
                    break;
                }
                continue;
            }
            if (grantAcccess) return next();
        }
        res.set('x-server-errortype', 'AccessDeniedException');
        return Response.unauthorized(res, { message: "access denied !, user not authorized to access resource", status: 403 });
    };
}

// eslint-disable-next-line consistent-return
async function authJwt(req, res, next) {
    try {
        const token = await extractToken(req);
        const verify = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
        req.query.auth_user_id = verify?.id;
        req.query.user_role = (verify?.role).join(',');
        next();
    } catch (error) {
        if (error?.name) {
            res.set('x-server-errortype', 'InvalidAccessTokenException');
            return Response.unauthorized(res, { message: error?.message });
        } 
        res.set('x-server-errortype', 'InternalServerError');
        return Response.error(res, { message: "something went wrong !" });
    }
}



module.exports = {
    authorize,
    authJwt,
};
