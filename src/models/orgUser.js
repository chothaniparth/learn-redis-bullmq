const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const OrgUserSchema = new mongoose.Schema({
    OrganizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizer', // Reference to the Organizer model
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
    },
    password: {
        type: String,
        required: true,
    },
    role : {
        type: String,
        enum: ['admin', 'sub-admin', 'volunteer'],
        default: 'admin'
    },
    custId: {
        type: String,
        required: true,
    }
}, {timestamps: true}); // Automatically manage createdAt and updatedAt fields

// Pre-save hook to hash the password before saving
OrgUserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next(); // Proceed to save the user
    } catch (error) {
        next(error); // Pass any errors to the next middleware
    }
});

// Optional: Add a method to compare passwords (for login)
OrgUserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const OrgUserModel = mongoose.model('OrgUser', OrgUserSchema);

module.exports = OrgUserModel;