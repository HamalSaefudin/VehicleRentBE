const User = require('../models/user');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

 
 const createUser = async (userPayload) => {
    if (await User.isEmailTaken(userPayload.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return User.create(userPayload);
};
 
const queryUser = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
};
 
const getUserById = async (userId) => {
    const user = User.findById(userId);
    return user;
}; 

const getUserByUsername = async (username) => User.findOne({ username });
 
const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};
 
const deleteUserById = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.remove();
};

module.exports = {
    createUser,
    queryUser,
    getUserById,
    getUserByUsername,
    updateUserById,
    deleteUserById,
};
