const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Books = new Schema({
    bookTitle: {type: String},
    name: {type: String},
    authorName: {type: String},
    imageURL: {type: String},
    category: {type: String},
    bookDescription: {type: String},
    bookPDFURL: {type: String}, 
    createdAt: {type: Date, default: Date.now}, 
    updateAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Books', Books); 