const joi = require('joi');

const createShedulerSchema = joi.object({
    organizerId: joi.string().required(),
    message: joi.string().required(),
    sendAt: joi.string().required(),
});

module.exports = {createShedulerSchema}