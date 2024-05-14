const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/auth')
const verifyAdmin = require('../middleware/authorization')
const BooksController = require('../controllers/BooksController')
const UserControllers = require('../controllers/UserController')
const CartController = require('../controllers/CartController')
const PaymentController = require('../controllers/PaymentController')
const OrderController = require('../controllers/OrderController')
const upload = require('../utils/multer.config');


function route(app) {
    app.get('/', BooksController.index);

    // BOOK
    app.get("/all-books", BooksController.findByCategory);
    app.get("/book/:id", BooksController.findById);
    app.get("/books/search", BooksController.findByTitle);
    app.get("/books/getTotalBook", BooksController.getTotalBooksByCategory);
    app.post("/upload-book", verifyToken, verifyAdmin, upload.single('bookImage'),  BooksController.create )
    app.patch("/book/:id", verifyToken, verifyAdmin, BooksController.updateById)
    app.patch("/bookquantity/:id", BooksController.updateQuantityById)
    app.delete("/book/:id", verifyToken, verifyAdmin, BooksController.deleteById)

    // USER 
    app.get("/all-users", UserControllers.getAllUsers);
    app.get("/user/:id", UserControllers.getUserById);
    app.post("/signup", UserControllers.signup);
    app.post("/login", UserControllers.login);
    app.patch("/user/:id", verifyToken, UserControllers.updateUser);
    app.post("/changepassword",verifyToken, UserControllers.changePassword);
    app.post("/fogotpassword", UserControllers.forgotPassword);
    app.put("/resetpassword", UserControllers.resetPassword)

    // CART
    app.get("/cart", verifyToken, CartController.getCart);
    app.post("/add/:bookId", verifyToken, CartController.addBookToCart);
    app.put("/remove/:bookId", verifyToken, CartController.removeBookFromCart);
    app.patch("/cart/quantity", verifyToken, CartController.updateBookQuantity);
    app.patch("/cart/update", verifyToken, CartController.updateCart);
    app.put("/clear", verifyToken, CartController.clearCart);
    app.get("/cart/totalprice", verifyToken, CartController.calculateTotalPrice);

    // PAYMENT
    app.post('/create_payment', verifyToken, PaymentController.createPaymenIntent);
    app.post('/payment_success', verifyToken, PaymentController.handlePaymentSuccess);
    app.post('/orders', verifyToken, PaymentController.handleOrder);

    // ORDER
    app.get('/totalRevenue', OrderController.getTotalRevenue);
}

module.exports = route;