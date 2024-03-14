const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const Books = require('../models/Books');
const User = require('../models/User')
const BooksController = require('../controllers/BooksController')
const UserControllers = require('../controllers/UserController')


function route(app) {
    app.get('/', BooksController.index);

    // find by category 
    app.get("/all-books", BooksController.findByCategory)
    // get a book 
    app.get("/book/:id", BooksController.findById)
    app.post("/upload-book", BooksController.create )
    app.patch("/book/:id", BooksController.updateById)
    app.delete("/book/:id", BooksController.deleteById)

    // USER 
    app.get("/all-users", UserControllers.getAllUsers)
    app.get("/user/:id", UserControllers.getUserById)
    // Sign up 
    app.post("/signup", UserControllers.signup)
    // Login
    app.post("/login", UserControllers.login)
    app.patch("/user/:id", UserControllers.updateUser);
    
}

module.exports = route;