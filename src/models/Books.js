const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Books = new Schema({
    bookTitle: {type: String},
    // name: {type: String},
    authorName: {type: String},
    imageURL: {type: String},
    category: {type: String},
    bookDescription: {type: String},
    bookPDFURL: {type: String}, 
    price: {type: Number, required: true }, 
},{
    timestamps: true, 
});

module.exports = mongoose.model('Books', Books); 