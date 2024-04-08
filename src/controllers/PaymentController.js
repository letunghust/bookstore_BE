const stripe = require("stripe")(
  "sk_test_51P1hnME80pxaWCvIBXXXmc9Dt7m54vH7pAuI9GX0DtrNjO5vZdWSEzSTM0DR2o71mETRJYdLv62Ri740wlNPIg0c00h4EX8zgJ"
);
const Cart = require("../models/Cart");
const User = require("../models/User");
const Order = require("../models/Order");

const createPaymenIntent = async (req, res) => {
  try {
    const { cartId, userId } = req.body;

    // Tìm giỏ hàng và người dùng trong cơ sở dữ liệu
    const cart = await Cart.findById(cartId).populate("books.book");
    const user = await User.findById(userId);

    const totalPrice = cart.books.reduce((total, item) => {
      return total + item.book.price * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100, // Giá trị tính bằng cent
      currency: "usd", 
      metadata: {
        userId: user._id.toString(),
        cartId: cart._id.toString(),
      },
    });

    // Trả về client_secret cho phía client
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error when payment" });
  }
};

const handlePaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Lấy thông tin PaymentIntent từ Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('payment intent:  ',paymentIntent);

    const userId = paymentIntent.metadata.userId;
    const cartId = paymentIntent.metadata.cartId;

    const cart = await Cart.findById(cartId).populate("books.book");
    const user = await User.findById(userId);

    // Tạo đơn hàng mới
    const order = new Order({
      user: user._id,
      books: cart.books,
      total_price: paymentIntent.amount / 100, 
      payment_status: "paid",
      payment_method: "stripe",
      shipping_address: {
        country: ""
      },
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await order.save();

    // Xóa giỏ hàng sau khi thanh toán thành công
    await Cart.findByIdAndDelete(cartId);

    res.json({ success: true, order });
  } catch (error) {
    // console.error(error);
    console.log(error)
    res
      .status(500)
      .json({ error: "Error when successful payment processing" });
  }
};

module.exports = {
  createPaymenIntent,
  handlePaymentSuccess,
};