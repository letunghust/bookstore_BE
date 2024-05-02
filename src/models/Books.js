const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Books = new Schema({
    bookTitle: {type: String},
    // name: {type: String},
    authorName: {type: String},
    year: {type: Number}, 
    publisher: {type: String}, 
    imageURL: {type: String},
    category: {type: String},
    bookDescription: {type: String},
    bookPDFURL: {type: String}, 
    price: {type: Number, required: true }, 
    quantity: {type: Number, required: true }, 
},{
    timestamps: true, 
});
Books.plugin(mongoosePaginate);

module.exports = mongoose.model('Books', Books); 