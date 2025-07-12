const joi = require('joi');

const CreateEventSchema = joi.object({
    organizerId: joi.string().required(),
    name: joi.string().required(),
    description: joi.string().required(),
    date: joi.date().required(),
    addresses: joi.array().items(joi.object({
        state: joi.string().required(),
        city: joi.string().required(),
        block: joi.string().required(),
        street: joi.string().required(),
        zip: joi.number().required()
    })).required()
});

const updateEventSchema = joi.object({
    _id: joi.string().required(),
    organizerId: joi.string().required(),
    name: joi.string().optional(),
    description: joi.string().optional(),
    date: joi.date().optional(),
    addresses: joi.array().items(joi.object({
        state: joi.string().optional(),
        city: joi.string().optional(),
        block: joi.string().optional(),
        street: joi.string().optional(),
        zip: joi.number().optional()
    })).optional()
});

const deleteEventSchema = joi.object({
    _id: joi.string().required()
});

module.exports = {
    CreateEventSchema,
    updateEventSchema,
    deleteEventSchema
};