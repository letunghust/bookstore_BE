const BooksController = require('../controllers/BooksController')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const Books = require('../models/Books');

function route(app) {
    app.get('/', BooksController.index);

    // find by category 
    app.get("/all-books", BooksController.findByCategory)
    // get a book 
    app.get("/book/:id", BooksController.findById)
    app.post("/upload-book", BooksController.create )
    app.patch("/book/:id", BooksController.updateById)
    app.delete("/book/:id", BooksController.deleteById)
   
}

module.exports = route;