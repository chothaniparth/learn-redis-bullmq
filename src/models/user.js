const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Or require('bcrypt'); if you're using that version

const UserSchema = new mongoose.Schema({
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
    }
    },{timestamps : true});

// Pre-save hook to hash the password before saving
UserSchema.pre('save', async function (next) {
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
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


// Create a Mongoose model for the User schema
const UserModel = mongoose.model('User', UserSchema);

// Export the User model for use in other parts of the application
module.exports = UserModel;