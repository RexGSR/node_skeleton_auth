const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
    role: { type: String, required: true, unique: true },
    role_active: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
});


const Role = model("Role", roleSchema);
module.exports = Role;