import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  //productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },

  orderType: { type: String, enum: ['delivery', 'takeaway'], required: true , default:'takeaway' },
  //quantity: { type: Number, required: true },
  address: { type: String }, // Optional, for delivery orders only
  items: [ // For multiple items from the cart
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
      quantity: { type: Number, required: true },
    }
  ],
  status: { 
    type: String, 
    enum: ['pending', 'Out for Delivery', 'delivered', 'cancelled', 'rejected', 'completed'], 
    default: 'pending' 
  }, // Order status
  total : { type: Number, required: true },
  //isCompleted: { type: Boolean, default: false }
  createdAt: { type: Date, default: Date.now },
});

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
