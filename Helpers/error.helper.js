function generateCustomError(message, name, code) {
    return new Promise((resolve, reject) => {
        let error = new Error(message || 'Something went wrong !');
        error.name = name || "system";
        error.resCode = code || 500;
        reject(error);
    })
}

module.exports = { generateCustomError };