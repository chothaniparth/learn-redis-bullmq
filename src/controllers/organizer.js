const {generateToken} = require('../utils/jwt');
const {handleError} = require('../utils/ResponseHandler');
const {organizerSignupSchema, organizerLoginSchema} = require('../dtos/Organizer/organizer');
const mongoose = require('mongoose');
const OrganizerModel = require('../models/organizer');
const OrgUserModel = require('../models/orgUser');
const Event = require('../models/event');
require('dotenv').config();

const OrganizerSignUp = async (req, res) => {
  try {
    const { error } = organizerSignupSchema.validate({ ...req.body }, { abortEarly: false });
    if (error) return res.status(400).json({ error: error.details });

    const { name, email, password, custId, state, city, block, street, zip } = req.body;

    await mongoose.connect(process.env.MONGODB_URI);

    const existingUser = await OrganizerModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: [{ message: 'User already exists' }] });
    }

    const organizer = new OrganizerModel({ name, email, password, custId });
    await organizer.save();

    const organizerId = organizer._id; // Proper ObjectId

    const orgUser = new OrgUserModel({
      name,
      email,
      password,
      role: 'admin',
      custId,
      OrganizerId: organizerId // Correct case and ObjectId
    });
    await orgUser.save();

    const event = new Event({
      organizer: organizerId, // Match schema field name
      name: 'Default Event',
      description: 'This is a default event created for the organizer.',
      date: new Date(),
      addresses: [{
        state,
        city,
        block,
        street,
        zip
      }]
    });
    await event.save();

    await mongoose.connection.close();

    return res.status(201).json({
      message: 'User created successfully',
      Organizer: organizer,
      token: generateToken({ name, email, custId, organizerId, role: 'admin' }),
    });

  } catch (err) {
    handleError(err, req, res);
  }
};

const OrganizerLogin = async (req, res) => {
    try {
        const { error } = organizerLoginSchema.validate({...req.body}, { abortEarly: false });
        
        if (error) {
            return res.status(400).json({ error: error.details });
        }
        
        const { email, password } = req.body;

        await mongoose.connect(process.env.MONGODB_URI);

        const user = await OrgUserModel.findOne({ email });
        
        if (!user) return res.status(404).json({ error: [{ message: 'User not found' }] });
        
        const isMatch = await user.comparePassword(password);
        
        await mongoose.connection.close();
        
        if (!isMatch) return res.status(401).json({ error: [{ message: 'Invalid credentials' }] });

        return res.status(200).json({ message: 'Login successful', user, token: generateToken({ name: user.name, email: user.email, custId: user.custId, organizerId: user.OrganizerId, role: user.role }) });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getOrganizerUser = async (req, res) => {
    try {
        const { _id } = req.params;

        await mongoose.connect(process.env.MONGODB_URI);

        const users = await OrgUserModel.find({_id: { $ne: _id } }).select('-password'); // Exclude password field

        await mongoose.connection.close();

        return res.status(200).json({ users });
    } catch (error) {
        handleError(error, req, res);
    }
}

module.exports = {
    OrganizerSignUp,
    OrganizerLogin,
    getOrganizerUser
}