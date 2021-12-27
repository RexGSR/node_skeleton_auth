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
async function read(Model, query) {
    try {
        const data = await Model.find(query);
        if (!data.length) return { success: true, data: { message: "No data found" } };
        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
}

module.exports = {
    isUnique,
    read,
    create,
};
