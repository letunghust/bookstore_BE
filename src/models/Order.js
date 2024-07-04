const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    books: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Books",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    total_price: { type: Number, required: true },
    payment_status: { type: String, default: "pending" },
    payment_method: { type: String },
    shipping_address: {
      full_name: { type: String },
      address_line_1: { type: String },
      address_line_2: { type: String },
      city: { type: String },
      state_province_region: { type: String },
      postal_code: { type: String },
      country: { type: String },
    },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
