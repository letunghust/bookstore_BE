const User = require('../models/User');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// [POST] sign up user 
const signup = async (req, res) => {
    const { name, surname, phone, email, password, is_admin } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, surname, phone, email, password: hashedPassword, is_admin });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    
}

//[POST] log in
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

    //    if(password !== user.password) {
    //         return res.status(401).json({message: 'Invalid credentials'});
    //    }
       // trả về token 
       const token = jwt.sign({
            _id : user._id
       }, 'MK')

        res.json({ 
            message: 'Login successful',
            token: token
         });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// [PATCH] update user
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//[GET] get all user 
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//[GET] get user by id
const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.signup = signup;
exports.login = login;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById; 
exports.updateUser = updateUser;