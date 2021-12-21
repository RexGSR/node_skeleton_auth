const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
/**
 * @description finds if the provided email is unique
 * @param model mongoose user model
 * @param email string: email provided by user
 * @returns object: { success: boolean, error: boolean || error }
 */
async function isUnique(model, email) {
    try {
        const count = await model.count({ email });
        if (count > 0) return { success: false, error: false };
        return { success: true, error: false };
    } catch (error) {
        return { success: false, error };
    }
}

/**
 * @description finds if the provided email is unique
 * @param model mongoose model
 * @param data object: data object that to be created
 * @returns object: { success: boolean, error: boolean || error }
 */
async function create(Model, user) {
    try {
        const dataModel = new Model(user);
        const data = await dataModel.save();
        return { success: true, data };
    } catch (error) {
        return { success: false, data: error };
    }
}

/**
 * @description finds data based on query and model
 * @param Model mongoose model
 * @param query object: data query eg: { email: user@email.com}
 * @returns  object: { success: boolean, data || error: object }
 */
async function getDataByQuery(Model, query) {
    try {
        const data = await Model.find(query);
        if (!data.length) return { success: true, data: { message: "No data found" } };
        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
}
/**
 * @description get user from user.json with similar email
 * @returns  data {object}, user data or false
 */
async function getAllUser() {
    const userPath = path.join(__dirname, "../Database/User.json");
    let data = await fs.readFile(userPath, "utf-8");
    data = await JSON.parse(data);
    data = data.users;
    if (!data?.length) return false;
    return data;
}
/**
 * @description generates hashed password for plain password
 * @param password string: password provided by user
 * @returns  hashed password or false
 */
async function generateHash(password) {
    const saltRounds = 12;
    const plainPassword = password;
    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        // logger.error('Failed to generate password hash')
        return false;
    }
}

/**
 * @description generates json web token for provided user with expiry time
 * @param user {object} user object and time
 * @param time token expiry time {'1h', '1M', 60*60}
 * @param secret secret key to sign jwt
 * @returns json web token or false
 */
async function generateToken(user, time, secret) {
    const {
        id,
        name,
        email,
        role,
    } = user;
    try {
        const token = jwt.sign({
            id,
            name,
            email,
            role,
        }, secret, { expiresIn: time });
        return token;
    } catch (error) {
        return false;
    }
}

/**
 * @description generates json web token for provided user with expiry time
 * @param token jwt token
 * @param secret jwt secret
 * @returns error or decoded data
 */
async function verifyToken(token, secret) {
    let error;
    let data;
    jwt.verify(token, secret, (err, decoded) => {
        if (err) error = err;
        data = decoded;
    });
    if (error?.name === "TokenExpiredError") return error.name;
    if (error) return false;
    return data;
}

function extractToken(req) {
    if (!Object.prototype.hasOwnProperty.call(req.headers, "authorization")) return false;
    let { authorization: token } = req.headers;
    if (!token.startsWith("Bearer")) return false;
    // eslint-disable-next-line prefer-destructuring
    token = token.split(" ")[1];
    return token;
}
/**
 * @description compares provided hash with user password
 * @param userPassword string: password provided by user
 * @param hash string: password hash from database
 * @returns boolean
 */
async function compareHash(userPassword, hash) {
    try {
        const match = await bcrypt.compare(userPassword, hash);
        if (match) return true;
        return false;
    } catch (error) {
        return false;
    }
}

module.exports = {
    isUnique,
    getDataByQuery,
    getAllUser,
    generateHash,
    create,
    generateToken,
    verifyToken,
    extractToken,
    compareHash,
};
