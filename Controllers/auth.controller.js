const {
    response,
    logger,
    isUnique,
    create,
    getDataByQuery,
    generateHash,
    generateToken,
    verifyToken,
    extractToken,
    compareHash,
} = require("../Helpers/index.helper");
const { User } = require("../Database/Models/index.model");
/**
 * @description Tries to register the user with provided body
 * @param req {object} Express req object
 * @param res {object} Express res object
 * @returns Express res object with the success/failure and data
 */
const register = async (req, res) => {
    const { name: reqName, email: reqEmail, password: reqPassword } = req.body;

    // unique email
    const findMail = await isUnique(User, reqEmail);
    if (!findMail?.success && findMail.error) logger.error(findMail.error);
    if (!findMail?.success) return response.forbidden(res, { message: `user already exists with: ${reqEmail}` });

    // hash password
    const passwordHash = await generateHash(reqPassword);
    if (!passwordHash) return response.error(res, {});

    // create user
    const createUser = await create(User, {
        name: reqName,
        email: reqEmail,
        password: passwordHash,
        role: ["user"],
    });
    if (!createUser?.success) logger.error(createUser?.data);
    if (!createUser?.success) return response.error(res, {});
    const {
        name,
        email,
        role,
        _id,
    } = createUser.data;
    const userData = {
        id: _id,
        name,
        email,
        role,
    };
    // generate token
    const accessToken = await generateToken(userData, "1h", process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = await generateToken(userData, "30 days", process.env.REFRESH_TOKEN_SECRET);
    if (!accessToken || !refreshToken) return response.error(res, {});
    return response.success(res, { data: [{ accessToken, refreshToken }] });
};

/**
 * @description Tries to login the user with provided body
 * @param req {object} Express req object
 * @param res {object} Express res object
 * @returns Express res object with the success/failure and data
 */
const login = async (req, res) => {
    const { email: reqEmail, password: reqPassword } = req.body;

    const user = await getDataByQuery(User, { email: reqEmail });
    if (!user.success) return response.error(res, {});
    if (user.success && user?.data?.message) return response.forbidden(res, { message: `user not registered: ${reqEmail}` });
    const {
        _id,
        name,
        email,
        password,
        role,
    } = user.data[0];

    const userData = {
        id: _id,
        name,
        email,
        role,
    };
    const passCheck = await compareHash(reqPassword, password);
    if (!passCheck) return response.unauthorized(res, { message: "invalid user name or password" });

    const accessToken = await generateToken(userData, "1h", process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = await generateToken(userData, "30 days", process.env.REFRESH_TOKEN_SECRET);

    if (!accessToken || !refreshToken) return response.error(res);
    return response.success(res, { data: [{ accessToken, refreshToken }] });
};

/**
 * @description Tries to login the user with provided body
 * @param req {object} Express req object
 * @param res {object} Express res object
 * @returns Express res object with the success/failure and generated token
 */
const generateTokens = async (req, res) => {
    const token = extractToken(req);
    if (!token) return response.badRequest(res, { status: 422 });
    const verify = await verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
    if (verify === "TokenExpiredError") return response.unauthorized(res, { message: "access token expired" });
    if (!verify && (typeof verify === "boolean")) return response.unauthorized(res, {});
    const user = await getDataByQuery(User, { id: verify.id });
    if (!user.success) return response.error(res, {});
    if (user.success && user?.data?.message) return response.forbidden(res, { message: "user not registered" });
    const {
        _id,
        name,
        email,
        role,
    } = user.data[0];

    const userData = {
        id: _id,
        name,
        email,
        role,
    };
    const accessToken = await generateToken(userData, "1h", process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = await generateToken(userData, "30 days", process.env.REFRESH_TOKEN_SECRET);
    if (!accessToken || !refreshToken) return response.error(res, {});
    return response.success(res, { data: [{ accessToken, refreshToken }] });
};

module.exports = {
    register,
    login,
    generateTokens,
};
