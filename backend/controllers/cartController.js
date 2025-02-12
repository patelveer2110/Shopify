import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

const calculateTotal = async (cart) => {
  let total = 0;
  if (!cart || !cart.items || cart.items.length === 0) {
    return 0;  // Return 0 if no items exist
  }

  for (let item of cart.items) {
    const product = await productModel.findById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
};

// Add an item to the cart
const addToCart = async (req, res) => {
  const { productId, quantity, adminId  } = req.body;
  const userId = req.userId;
  
  try {
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    
    let cart = await cartModel.findOne({ userId, adminId });
    const instock = product.inStock
    // let qty 
    // qty = (!instock)?0:1
    // console.log(qty);
    if (!cart) {
      cart = new cartModel({
        userId,
        adminId,
        items: [{ productId, quantity}],
      });
    } else {
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }
    console.log(cart);
    
    cart.total = await calculateTotal(cart);
    await cart.save();
    res.status(200).json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get cart items grouped by adminId
const getCartItems = async (req, res) => {
  const userId = req.userId;

  try {
    const carts = await cartModel.find({ userId })
      .populate("items.productId", "name price image inStock")
      .populate("adminId", "shopName");

    res.json({ success: true, carts });
  } catch (error) {
    res.status(500).json({ success: false, message: "fdcx"+error.message });
  }
};

// Remove a specific item from the cart
const removeFromCart = async (req, res) => {
  const { cartId, productId } = req.params;

  console.log(productId);
  console.log(cartId);
  try {
    let cart = await cartModel.findById(cartId);
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
    
    // Ensure the productId is being matched as ObjectId
    console.log(cart);
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    console.log(cart);
    
    if (cart.items.length === 0) {
      await cartModel.deleteOne({ _id: cartId });
      console.log(`Cart with ID ${cartId} has been removed`);
      return res.json({ success: true, message: "Cart is empty, and was removed" });
    }
    
    cart.total = await calculateTotal(cart);
    await cart.save();

    res.json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  const userId = req.userId;

  try {
    await cartModel.deleteMany({ userId });
    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0." });
    }

    console.log("Cart ID:", cartId, "Product ID:", productId);

    const cart = await cartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.total = await calculateTotal(cart);
    await cart.save();

    res.status(200).json({ success: true, message: "Quantity updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while updating quantity." });
  }
};


export {addToCart, getCartItems, removeFromCart, clearCart,updateQuantity}