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

module.exports = {
    getTotalRevenue,
}