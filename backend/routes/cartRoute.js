import express from "express";
import { addToCart, getCartItems, removeFromCart, clearCart, updateQuantity } from "../controllers/cartController.js";
import userAuth from "../middleware/userAuth.js"; // Ensure user is authenticated

const cartRouter = express.Router();

// Add an item to the cart
cartRouter.post("/add", userAuth, addToCart);

// Get all cart items for the authenticated user
cartRouter.get("/items", userAuth, getCartItems);

// Remove a specific product from the cart using its cartId and productId
cartRouter.delete("/remove/:cartId/:productId", userAuth, removeFromCart);

cartRouter.put("/update/:cartId/:productId", userAuth, updateQuantity);

// Clear the entire cart for the authenticated user
cartRouter.delete("/clear/all", userAuth, clearCart);

export default cartRouter;
