const joi = require('joi');
const userSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).required(),
});
const updateUserSchema = joi.object({
    name: joi.string().min(3).max(30),
    email: joi.string().email(),
    password: joi.string().min(6).max(30),
}).or('name', 'email', 'password'); // At least one field must be present
const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).required(),
});
const changePasswordSchema = joi.object({
    oldPassword: joi.string().min(6).max(30).required(),
    newPassword: joi.string().min(6).max(30).required(),
});
module.exports = {
    userSchema,
    updateUserSchema,
    loginSchema,
    changePasswordSchema
};
// This code defines Joi schemas for validating user data in a Node.js application.