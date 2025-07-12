const joi = require('joi');

const organizerSignupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    custId: joi.string().required(),
    street: joi.string().required(),
    block: joi.string().required(),
    city: joi.string().required(),
    zip: joi.number().required(),
    state: joi.string().required()
})

const organizerLoginSchema = joi.object({
    email : joi.string().email().required(),
    password : joi.string().min(6).required()
})

module.exports = {
    organizerSignupSchema,
    organizerLoginSchema
}