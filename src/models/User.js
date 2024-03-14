const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const User = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    is_admin: { type: Boolean, default: false },
    createdAt: {type: Date, default: Date.now}, 
    updateAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('User', User)