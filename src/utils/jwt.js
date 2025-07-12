const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateToken = (user) => {
    return jwt.sign(
        user,
        process.env.JWT_SECRET)
}