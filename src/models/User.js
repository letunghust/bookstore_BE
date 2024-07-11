const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// const crypto = require('crypto-js');
const crypto = require('crypto');

const User = new Schema({
    User_ID : {type: Number, required: true },
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
    isBlocked: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String, 
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
        type: Date,
    },
}, {
    timestamps: true, 
});

User.methods = {
    createPasswordChangedToken: function() {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // mã hóa resetToken 
        this.passwordResetExpires = new Date(Date.now() + 5 * 60 * 1000);
        return this.passwordResetToken;
    }
}

module.exports = mongoose.model('User', User)
