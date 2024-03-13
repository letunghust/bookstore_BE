const User = require('../models/User');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const signup = async (req, res) => {
    const { name, surname, phone, email, password, is_admin } = req.body;

    try {
        const newUser = new User({ name, surname, phone, email, password, is_admin });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.signup = signup;