const Response = require("../Helpers/response.helper");
const logger = require("../Helpers/logger");
// import {logger} from '../Helper/logger';
const { IST } = require("../Helpers/dateTime.helper");

const { generateCustomError } = require("../Helpers/error.helper");
const AuthHelper = require("../Helpers/auth.helper");
const DB = require("../Helpers/crud.helper");

const User = require("../Database/Models/user.model");
const Role = require("../Database/Models/role.model");

const {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    APP_NAME,
} = process.env;

/**
 * @description Tries to register the user with provided body
 * @params data {Object}
 * @returns Express res object with the success/failure and data
 */
async function register(req, res, next) {
    try {
        // unique email check
        await DB.isUnique(User, { email: req.body.email });
        
        // TODO: make sure to set role as VENDOR if it is not ADMIN 
        const role = await DB.read(Role, { role: "USER" });
        // hash password
        const passwordHash = await AuthHelper.generateHash(req.body.password);

        // create user
        let createdUser = await DB.create(User, {
            name: req.body.name || req.body.username || null,
            email: req.body?.email || null,
            phone: req.body?.phone || null,
            password: passwordHash,
            device_token: req.body.token || null,
            role: [role[0].id],
            created_at: IST(),
            updated_at: IST()
        });
        
        //array conversion if not an array
        if (!createdUser instanceof Array) createdUser = [{ ...createdUser }];
        
        // access token
        const accessToken = await AuthHelper.generateToken({
            id: createdUser[0]._id,
            email: createdUser[0].email,
            role: createdUser[0].role,
            activeStatus: createdUser[0].activeStatus,
        }, ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET);
        
        // refresh token
        const refreshToken = await AuthHelper.generateToken({
            id: createdUser[0]._id,
            email: createdUser[0].email,
            role: createdUser[0].role,
            activeStatus: createdUser[0].activeStatus,
        }, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET);

        //setting http-only cookie on frontend
        res.cookie(APP_NAME, JSON.stringify({ refreshToken }), {
            secure: true,
            httpOnly: true,
            expires: IST("date", 30, "days"),
        });
        Response.success(res, {
            data: [{
                accessToken: accessToken,
                refreshToken: refreshToken,
                name: createdUser[0].name,
                email: createdUser[0].email || null,
                phone: createdUser[0].phone || null,
                id: createdUser[0]._id,
            }]
        });

        
        await DB.update(User, { query: { _id: createdUser[0]._id }, data: { activeStatus: true, refresh_token: refreshToken,  updated_at: IST("database") } });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Tries to login the user with provided body
 * @param req {object} Express req object
 * @param res {object} Express res object
 * @returns Express res object with the success/failure and data
 */
const login = async (req, res, next) => {
    try {
        let query = {};
        
        if (req.body?.email) query.email = req.body.email;
        else if (req.body?.phone) query.email = req.body.phone;
        else await generateCustomError("BAD REQUEST", "bad_request", 400);

        const user = await DB.read(User, query);

        if (!user.length) await generateCustomError("Please register and try again !", "user_not_found", 400);
        if (user[0]?.is_deleted) await generateCustomError("Account Blocked !", "account_blocked", 400);
       
        await AuthHelper.compareHash(req.body.password, user[0].password);
        delete user[0].password;
        delete user[0].is_deleted;


        

        const accessToken = await AuthHelper.generateToken({
                ...user[0],
                device_token: req.body.token
            },
            ACCESS_TOKEN_EXPIRY,
            ACCESS_TOKEN_SECRET
        );

        // eslint-disable-next-line max-len
        const refreshToken = await AuthHelper.generateToken({
                ...user[0],
                device_token: req.body.token
            },
            REFRESH_TOKEN_EXPIRY,
            REFRESH_TOKEN_SECRET
        );
        
        await DB.update(User, { query: { _id: user[0].id }, data: { device_token: req.body.token, refresh_token: refreshToken, updated_at: IST("database") } });

        res.cookie(APP_NAME, JSON.stringify({ refreshToken }), {
            secure: true,
            httpOnly: true,
            expires: IST("date", 30, "days"),
        });
        Response.success(res, {
            data: [
                {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    ...user[0],
                    device_token: req.body.token,
                    date: IST()
                }
            ]
        });
        
    } catch (error) {
        next(error);
    }
};



/**
 * @description Tries to login the user with provided body
 * @param req {object} Express req object
 * @param res {object} Express res object
 * @returns Express res object with the success/failure and generated token
 */
const generateTokens = async (req, res, next) => {
    try {
        let token = JSON.parse(req.cookies[APP_NAME]);
        token = token?.refreshToken;
        if (!token) return Response.badRequest(res, { status: 422 });
        const verify = await AuthHelper.verifyToken(token, REFRESH_TOKEN_SECRET);
        if (verify?.expired) return Response.unauthorized(res, { message: "refresh token expired" });

        if (verify?.error) return Response.unauthorized(res);
        const user = await DB.read(User, { _id: verify?.data.id });
        if (user?.error) return Response.error(res);
        if (user?.message) return Response.forbidden(res, { message: "user not registered" });

        if (!user.data[0].activeStatus) return Response.unauthorized(res, { message: "please login again" });
        const userData = {
            // eslint-disable-next-line no-underscore-dangle
            id: user.data[0]._id,
            name: `${user.data[0].firstName} ${user.data[0].lastName}`,
            email: user.data[0].email,
            role: user.data[0].role,
            image: user.data[0].image,
        };
        const accessToken = await AuthHelper.generateToken(userData, ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET);
        if (!accessToken) throw new Error("Error on: File[auth.controller.js] function[generateTokens] { call to generateTokens() }, error: error generating access and refresh token");
        return Response.success(res, { data: [{ accessToken }] });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const { id } = req.params;
        await DB.update(User, { query: { _id: id }, data: { activeStatus: false, updatedAt: IST("database") } });
        return Response.success(res, { message: "user logged out !" });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    register,
    login,
    logout,
    generateTokens,
};
