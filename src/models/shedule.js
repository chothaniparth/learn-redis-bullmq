const mongoose = require('mongoose');

const taskShedulerSchema = new mongoose.Schema({
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizer', // Reference to the Organizer model
        required: true,
    },
    message: {
        type : String,
        required : true
    },
    sendAt: {
        type : Date,
        required : true
    }
}, {timestamps: true})

const Sheduler = mongoose.model('Scheduler', taskShedulerSchema)

module.exports = Sheduler;