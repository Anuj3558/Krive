import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
  },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the product
  selectedOptions: { type: Map, of: String }, // e.g., { "Color": "Blue", "Size": "M" }
  totalPrice: { type: Number, required: true }, // Total price including customization options
  createdAt: { type: Date, default: Date.now }, // Timestamp of the order
});

const Order = mongoose.model('Order', orderSchema);



export default Order;