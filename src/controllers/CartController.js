const Cart = require('../models/Cart');
// const Books = require('../models/Books');

// [GET] get cart 
const getCart = async(req, res) => {
    try{
        const cart = await Cart.findOne({user: req.user._id}).populate('books.book');
        if (!cart || !cart.books) {
            return res.status(404).json({message: 'Cart is empty or not found'});
        }
        // console.log(cart);
        res.json(cart);
    } catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Server error'});
    }
}

// [POST] add book to cart 
const addBookToCart = async (req, res) => {
    try{
        const userId = req.user._id;
        const bookId = req.params.bookId;
        console.log(bookId)
        const quantity = req.body.quantity;

        let cart = await Cart.findOne({user: userId});
        // console.log(cart)
        if (!cart) {
            cart = new Cart({ user: userId, books: [] });
        }
        
        const existingItem = cart.books.find(item => item.book.toString() === bookId);
        
        if(existingItem) {
            // cart.books.find(item => item.quantity += 1);
            cart.books = cart.books.map(item =>
                item.book.toString() === bookId ? { ...item, quantity: item.quantity + quantity } : item
              );
        }
        else {
            cart.books.push({book: bookId, quantity: quantity});
        }
        // console.log('cart book ',cart.books)
        
         // Cập nhật thông tin giỏ hàng (giá sách, tổng giá trị giỏ hàng, ...)
        // cart.totalPrice = cart.books.reduce((total, item) => total + item.quantity * item.book.price, 0);
        await cart.save();

        res.status(200).send({messsage: "Book added to cart successfully"});
    } catch(error) {
        console.log(error)
        res.status(500).send({messsage: 'Error adding booking to cart'}); 
    }
}

// [PUT] remove book from cart
const removeBookFromCart = async(req, res) => {
    try{
        const cart = await Cart.findOne({user: req.user._id});
        if(!cart) return res.status(404).json({message: 'Cart not found'});

        const bookIndex = cart.books.findIndex(book => book.book.toString() === req.params.bookId);
        if(bookIndex === -1) return res.status(404).json({message: 'Book not found in cart'})

        // remove the book from the cart
        cart.books.splice(bookIndex, 1);
        await cart.save();

        return res.status(200).json({ message: 'Book removed from cart'});
    } catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Server error'});
    }
}

// [PUT] update book quantity
const updateBookQuantity = async(req, res) => {
    try{
        const {bookId, quantity} = req.body;
        const userId = req.user._id;
        const cart = await Cart.findOne({user: userId});
        if( !cart) return res.status(404).json({message: 'Cart not found'});

        const bookIndex = cart.books.findIndex(book => book.book.toString() === bookId);
        if(bookIndex === -1) return res.status(404).json({message: 'Book not found in cart'});

        cart.books[bookIndex].quantity = quantity;
        await cart.save();
        return res.json({message: 'Quantity updated successfully'});
    } catch(error) {
        console.log(error);
        return res.status(500).json({message: 'Server error'});
    }
}

// [PUT] update cart
const updateCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const {books} = req.body; 

        let cart = await Cart.findOne({user: userId});
        if(!cart) {
            cart = new Cart({user: userId, books: []});
        }

        cart.books = books;
        await cart.save(); 
        
        res.status(200).json({message: "Cart updated successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error updating cart"});
    }
}

// [PUT] clear cart
const clearCart = async(req, res) => {
    try{
        const cart = await Cart.findOne({user: req.user._id});
        if(!cart) return res.status(404).json({error: 'Cart not found'});

        cart.books = [];
        cart.total_price = 0
        await cart.save();
        return res.status(200).json({message: 'Cart cleared'});
    } catch(error) {
        console.log(error);
        res.status(500).json({error: 'Error clearing cart'});
    }   
}

// [GET] calculate total price
const calculateTotalPrice = async(req, res) => {
    try{
        const cart = await Cart.findOne({user: req.user._id}).populate('books.book')
        console.log(cart)
        let totalPrice = 0;
        cart.books.forEach(book => {
            const bookPrice = book.book && book.book.price ? book.book.price : 0;
            const quantity = !isNaN(book.quantity) ? book.quantity : 0; 
            totalPrice += bookPrice * quantity;
        });
        cart.total_price = totalPrice;
        await cart.save();
        return res.status(200).json({total_price: totalPrice});
    } catch(error) {
        console.log(error);
        return res.status(500).json({message: "Server Error"});
    }
}

module.exports = {
    addBookToCart, 
    updateBookQuantity,
    updateCart,
    removeBookFromCart, 
    getCart,
    clearCart,
    calculateTotalPrice,
}