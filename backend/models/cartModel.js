import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  quantity: { type: Number, default: 1, min: 0 },
});

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // User-specific cart
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "admin", required: true }, // Shop reference
  items: [CartItemSchema], // Multiple items in a single cart
  total : { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const cartModel = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default cartModel;
