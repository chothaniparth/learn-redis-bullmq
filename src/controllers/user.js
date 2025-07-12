const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/jwt');
const {handleError} = require('../utils/ResponseHandler');
const { userSchema, updateUserSchema, loginSchema, changePasswordSchema } = require('../dtos/user/user');
const { default: mongoose } = require('mongoose');
const { format } = require('@fast-csv/format');
require('dotenv').config();

const CreateUser = async (req, res)=> {
    try{
        const { error } = userSchema.validate({...req.body}, { abortEarly: false });
        
        if (error) {
            return res.status(400).json({ error: error.details});
        }
        const { name, email, password } = req.body;

        await mongoose.connect(process.env.MONGODB_URI);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: [{message : 'User already exists'}] });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();

        // close database connection
        await mongoose.connection.close();
        
        return res.status(201).json({ message: 'User created successfully', user: newUser, token : generateToken({name, email}) });
    }catch(err){
        handleError(err, req, res);
    }
}

const loginUser = async (req, res) => {
    try {
        const { error } = loginSchema.validate({...req.body}, { abortEarly: false });
        
        if (error) {
            return res.status(400).json({ error: error.details });
        }
        
        const { email, password } = req.body;

        await mongoose.connect(process.env.MONGODB_URI);

        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ error: [{ message: 'User not found' }] });
        
        const isMatch = await user.comparePassword(password);
        
        await mongoose.connection.close();
        
        if (!isMatch) return res.status(401).json({ error: [{ message: 'Invalid credentials' }] });
        
        return res.status(200).json({ message: 'Login successful', user, token : generateToken({ name: user.name, email: user.email }) });
    }catch(error){
        console.error("Error logging in user:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getUsers = async (req, res) => {
    try {
        const { _id } = req.params;

        await mongoose.connect(process.env.MONGODB_URI);

        const users = await User.find({_id: { $ne: _id } }).select('-password'); // Exclude password field
        
        await mongoose.connection.close();

        return res.status(200).json({ users });
    } catch (error) {
        handleError(error, req, res);
    }
}

const exportUserExcel = async (req, res)=>{
    try{
        const { _id } = req.params;

        await mongoose.connect(process.env.MONGODB_URI);

        const users = await User.find({_id: { $ne: _id } }).select('-password'); // Exclude password field
        
        await mongoose.connection.close();

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');

        const csvStream = format({ headers: ['user name', 'user email'] });

        csvStream.pipe(res);
        users.forEach(user => csvStream.write({
            'user name': user.name,
            'user email' : user.email
        }));
        csvStream.end();
    }catch(error){
        handleError(error, req, res);
    }
}

module.exports = {
    CreateUser,
    loginUser,
    getUsers,
    exportUserExcel
}