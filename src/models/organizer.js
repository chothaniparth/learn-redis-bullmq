const mongoose = require('mongoose');

const OrganizerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
        match: /.+\@.+\..+/ // Basic email validation regex
    },
    custId: {
        type: String,
        required: true,
    },
}, {timestamps: true}); // Automatically manage createdAt and updatedAt fields

const OrganizerModel = mongoose.model('Organizer', OrganizerSchema);

module.exports = OrganizerModel;