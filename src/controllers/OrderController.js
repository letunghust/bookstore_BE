const Order = require('../models/Order');

// [GET] get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'user',
                select: 'name email'
            })
            .populate({
                path: 'books.book',
                select: 'bookTitle'
            });
            
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

// [GET] get all pending orders 
const getPendingOrders = async (req, res) => {
    try {
        const pendingOrders = await Order.find({order_status: 'pending'})
            .populate('user', 'name')
            .lean();
        if(!pendingOrders) {
            return res.status(404).json({message: 'not found!'})
        }

        res.json(pendingOrders);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// [GET] get total revenue
const getTotalRevenue = async (req, res) => {
    try{
        const totalRevenue = await Order.aggregate([
            {$group: {
                _id: null, 
                total: {$sum: '$total_price'},
            }}
        ]);

        res.json(totalRevenue[0].total || 0);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'})
    }
}

// [GET] get order of each user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({user: userId}).populate('books.book');
        res.status(200).json(orders);
    } catch(error) {
        res.status(500).json({error: 'Internal server error'});
    }
}

// [PATCH] confirm order
const confirmOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findByIdAndUpdate(orderId, {order_status: 'confirmed'});

        if(!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        res.json(order);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    getAllOrders,
    getPendingOrders,
    getTotalRevenue,
    getUserOrders,
    confirmOrder,
}