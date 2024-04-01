const Cart = require('../models/Cart');

// [GET] get cart 
const getCart = async(req, res) => {
    try{
        const cart = await Cart.findOne({user: req.user._id}).populate('books.book');
        if (!cart || !cart.books) {
            return res.status(404).json({message: 'Cart is empty or not found'});
        }
        console.log(cart.books);
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
        console.log(userId)
        const bookId = req.params.bookId;
        console.log(bookId)
        const quantity = req.body.quantity;
        console.log(quantity)

        let cart = await Cart.findOne({user: userId});
        console.log(cart);

        if (!cart) {
            cart = new Cart({ user: userId, books: [] });
        }
        // if (!books) {
        //     return res.status(404).send({ message: 'Book not found' });
        // }
        const index = cart.books.findIndex(book => book.book.toString === bookId); 
        
        if(index !== -1) {
            cart.books[index].quantity += quantity;
        } else{
            cart.books.push({book: bookId, quantity: quantity});
        }

         // Cập nhật thông tin giỏ hàng (giá sách, tổng giá trị giỏ hàng, ...)
        // cart.totalPrice = cart.books.reduce((total, item) => total + item.quantity * item.book.price, 0);
        await cart.save();

        res.status(200).send({messsage: 'Book added to cart successfully'});
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

// [GET] caculate total price
const calculateTotalPrice = async(req, res) => {
    try{
        const cart = await Cart.findOne({user: req.user._id}).populate('books.book')
        let totalPrice = 0;
        cart.books.forEach(book => {
            totalPrice += book.book.price * book.quantity;
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
    removeBookFromCart, 
    getCart,
    clearCart,
    calculateTotalPrice,
}