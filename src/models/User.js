const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const User = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    // is_admin: { type: Boolean, default: false },
    role: {
        type: String,
        enum: ['user', 'cashier', 'admin'],
        default: 'user', 
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [{type: mongoose.Types.ObjectId, ref: 'Address'}],
    wishlist: [{type: mongoose.Types.ObjectId, ref: 'Product'}],
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String, 
    },
    passwordChangeAt: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: String, 
    },
    // createdAt: {type: Date, default: Date.now}, 
    // updateAt: {type: Date, default: Date.now},
}, {
    timestamps: true, 
});

module.exports = mongoose.model('User', User)