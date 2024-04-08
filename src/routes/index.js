const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/auth')
const BooksController = require('../controllers/BooksController')
const UserControllers = require('../controllers/UserController')
const CartController = require('../controllers/CartController')
const PaymentController = require('../controllers/PaymentController')

function route(app) {
    app.get('/', BooksController.index);

    // BOOK
    // find by category 
    app.get("/all-books", BooksController.findByCategory)
    app.get("/book/:id", BooksController.findById)
    app.post("/upload-book", BooksController.create )
    app.patch("/book/:id", BooksController.updateById)
    app.delete("/book/:id", BooksController.deleteById)

    // USER 
    app.get("/all-users", UserControllers.getAllUsers)
    app.get("/user/:id", UserControllers.getUserById)
    app.post("/signup", UserControllers.signup)
    app.post("/login", UserControllers.login)
    app.patch("/user/:id", UserControllers.updateUser);
    app.get("/fogotpassword", UserControllers.forgotPassword);

    // CART
    app.get("/cart", verifyToken, CartController.getCart);
    app.post("/add/:bookId", verifyToken, CartController.addBookToCart);
    app.put("/remove/:bookId", verifyToken, CartController.removeBookFromCart);
    app.patch("/cart/quantity", verifyToken, CartController.updateBookQuantity);
    app.put("/clear", verifyToken, CartController.clearCart);
    app.get("/cart/totalprice", verifyToken, CartController.calculateTotalPrice);

    // PAYMENT
    app.post('/create_payment', verifyToken, PaymentController.createPaymenIntent);
    app.post('/payment_success', verifyToken, PaymentController.handlePaymentSuccess);
}

module.exports = route;