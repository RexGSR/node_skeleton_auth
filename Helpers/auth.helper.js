const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
 * @param user {object} user object
 * @param time token expiry time {'1h', '1M', 60*60}
 * @param secret secret key to sign jwt
 * @returns json web token or false
 */
async function generateToken(data, time, secret) {
    try {
        const token = jwt.sign(data, secret, { expiresIn: time });
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

/**
 * @description extracts Bearer token from request headers
 * @param req req object
 * @returns false or token
 */
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
    generateHash,
    generateToken,
    verifyToken,
    extractToken,
    compareHash,
};
