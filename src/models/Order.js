const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  books: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Books', required: true },
    quantity: { type: Number, required: true }
  }],
  total_price: { type: Number, required: true },
  payment_status: { type: String, default: 'pending' }, // trạng thái thanh toán ('pending', 'paid', 'failed')
  payment_method: { type: String }, // phương thức thanh toán (ví dụ: 'stripe')
  shipping_address: { // địa chỉ giao hàng
    full_name: { type: String, required: true },
    address_line_1: { type: String, required: true },
    address_line_2: { type: String },
    city: { type: String, required: true },
    state_province_region: { type: String },
    postal_code: { type: String, required: true },
    country: { type: String, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);