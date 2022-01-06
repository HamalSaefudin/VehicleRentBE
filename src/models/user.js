const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const paginate = require('./plugin/paginate.plugin');
const toJson = require('./plugin/toJson.plugin');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        private: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isEmailVerified: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

userSchema.plugin(toJson);
userSchema.plugin(paginate);

/**
 * Check email is taken
 * @param {string} email - The users email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<Boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

/**
 * Check if the password is match
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
