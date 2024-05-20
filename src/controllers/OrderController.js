const Order = require('../models/Order');

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

module.exports = {
    getTotalRevenue,
    getUserOrders,
}