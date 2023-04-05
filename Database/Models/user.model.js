const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    email_validated: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        unique:true,
        sparse: true,
    },
    role:[
        {
            type: Schema.Types.ObjectId,
            ref: "Role",
        }
    ],
    device_token: {
        type: String,
    },
    refresh_token: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    active_status: {
        type: Boolean,
        default: false,
    },
    profile_image: {
        type: String,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
});


const User = model("User", userSchema);
module.exports = User;
