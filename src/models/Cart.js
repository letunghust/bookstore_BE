const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    books: [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Books',
            required: true,
        },
        quantity: { 
            type: Number,
            required: true, 
        }
    }],
    total_price: {
        type: Number, 
        // required: true,
    },
}, {
    timestamps: true, 
});

module.exports = mongoose.model('Cart', CartSchema);