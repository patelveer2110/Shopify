import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate, Link } from "react-router-dom";  // Use this for history navigation
import { backendUrl } from "../../App";

const Cart = ({ token }) => {
  const [cart, setCart] = useState([]);
  // const [totalByShop, setTotalByShop] = useState({});
  const navigate = useNavigate();  // Use this hook for redirection

  const fetchCart = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/cart/items", {
        headers: { token: token },
      });

      console.log("hgf", response);

      if (response.data.success) {
        const updatedCart = response.data.carts.filter((cartItem) => cartItem.items.length > 0);
        console.log("Cart Items:", response.data.carts.map((cartItem) => cartItem.items));

        setCart(updatedCart);
        console.log(cart);

        //calculateTotal(response.data.carts); // Recalculate total after fetching carts
      } else {
        console.error("Error fetching cart:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error.response ? error.response.data : error.message);
    }
  };

  // Function to calculate total price for each shop
  // const calculateTotal = (carts) => {
  //   const totals = {};

  //   carts.forEach((cartItem) => {
  //     cartItem.items.forEach((item) => {
  //       const itemTotal = item.quantity * item.productId.price;
  //       if (totals[cartItem.adminId.shopName]) {
  //         totals[cartItem.adminId.shopName] += itemTotal;
  //       } else {
  //         totals[cartItem.adminId.shopName] = itemTotal;
  //       }
  //     });
  //   });

    // setTotalByShop(totals); // Store total prices by shop
  // };

  // Function to handle changing the quantity of an item
  const changeQuantity = async (cartId, productId, quantity) => {
    try {
      if (quantity < 1) return; // Prevent invalid quantity updates

      console.log(cartId + "\n" + productId);

      const response = await axios.put(
        `${backendUrl}/api/cart/update/${cartId}/${productId}`,
        { quantity },
        { headers: { token: token } }
      );

      console.log(response); // Log the response data for debugging

      if (response.data.success) {
        fetchCart(); // Refetch the cart to ensure correct state
        toast.success("Quantity updated successfully.");
      } else {
        toast.error(response.data.message || "Failed to update quantity.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error.response ? error.response.data : error.message);
      toast.error(error.response ? error.response.data : error.message);
    }
  };

  // Function to handle removing an item from the cart
  const removeFromCart = async (cartId, productId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/cart/remove/${cartId}/${productId}`,
        { headers: { token: token } }
      );
      console.log("Remove from cart response:", response.data);
  
      if (response.data.success) {
        // Update the cart state directly after removing the item
        setCart(prevCart => {
          const updatedCart = prevCart.map(cartItem => {
            if (cartItem._id === cartId) {
              const updatedItems = cartItem.items.filter(item => item._id !== productId);
              return updatedItems.length > 0 ? { ...cartItem, items: updatedItems } : null;
            }
            return cartItem;
          }).filter(cartItem => cartItem !== null);
  
          return updatedCart;
        });
        fetchCart();
        toast.success("Item removed from cart.");
      } else {
        toast.error(response.data.message || "Failed to remove item.");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Error removing item from cart.");
    }
  };
  
  
  

  const clearCart = async () => {
    try {
      const response = await axios.delete(`${backendUrl}/api/cart/clear/all`, {
        headers: { token: token },
      });
      if (response.data.success) {
        setCart([]);
        // setTotalByShop({});
        toast.success("Cart cleared!");
      } else {
        toast.error(response.data.message || "Failed to clear cart.");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Error clearing cart.");
    }
  };

  // Function to handle placing the order for a specific shop
  const placeOrderForShop = async (cartId) => {
    try {
      // console.log(cartId);
      // navigate(`/order/${cartId}`)

      // Ensure the `items` field is an array, even if it has only one item
      //   const orderData = {
      //     adminId,
      //     items: cartItem.items.map(({ productId, quantity, orderType = 'takeaway' }) => ({
      //       productId: productId._id,  // Ensure productId is in the correct format
      //       quantity,
      //       orderType,
      //     }))
      //   };

      //   // Log the orderData to check its structure
      //   console.log("Order Data", orderData);  

      //   // Send the orderData with the items array
      //   const { data } = await axios.post(
      //     `${backendUrl}/api/order/place-order`,
      //     { orders: [orderData] }, // Wrap orderData in an array of orders
      //     { headers: { token } }
      //   );

      //   if (data.success) {
      //     const orderId = data.orderId;
      //     console.log(orderId);
      //     //Assuming the response contains orderId
      //     navigate(`/order/${orderId}`);  // Redirect to the order page with the orderId
      //   } else {
      //     toast.error(data.message || "Failed to place order.");
      //   }
    } catch (error) {
      console.error("Error placing order:", error.response ? error.response.data : error.message);
      toast.error(error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>
      {cart.length > 0 ? (
        cart.map((cartItem) => (
          <div key={cartItem._id} className="cart-group border-b border-gray-300 pb-4 mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              {cartItem.adminId ? cartItem.adminId.shopName : "Unknown Shop"}
            </h3>
            {cartItem.items.map((item) => {
              const itemTotal = item.quantity * item.productId.price; // Calculate item total
              return (
                <div key={item._id} className="product-item flex items-center mb-4">
                  <img
                    src={item.productId.image} // Assuming `image` is part of productId
                    alt={item.productId.name}
                    className="w-24 h-24 object-cover mr-4"
                  />
                  <div className="product-details flex-1">
                    <p className="text-lg text-gray-600">Product: {item.productId ? item.productId.name : "Unknown Product"}</p>
                    <p className="text-lg text-gray-600">Price: ₹{item.productId ? item.productId.price : "N/A"}</p>
                    <>{item.productId.inStock?(
                      <div className="quantity-actions flex items-center mt-2">
                      <label htmlFor={`quantity-${item.productId._id}`} className="text-lg text-gray-600">
                        Quantity:
                      </label>
                      <input
                        type="number"
                        id={`quantity-${item.productId._id}`}
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value, 10);
                          if (newQuantity >= 1) {
                            changeQuantity(cartItem._id, item.productId._id, newQuantity);
                          }
                        }}
                        min="1"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>):( <p className="text-lg text-red-500 font-bold">Out of Stock</p>)}
                    </>
                    <p className="text-lg text-gray-600">Total: ₹{(item.quantity)*(item.productId.price)}</p>
                    <button
                      onClick={() => removeFromCart(cartItem._id, item.productId._id)}
                      className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="shop-total mt-4 text-xl font-semibold text-gray-800">
              <p>Total for {cartItem.adminId.shopName}: ₹{cartItem.total}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => placeOrderForShop(cartItem._id)}
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
              >
                <Link to={`/order/${cartItem._id}`} className="text-white">Place Order for {cartItem.adminId.shopName}</Link>
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-xl text-gray-500">Your cart is empty</p>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => clearCart()}
          className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition duration-300"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;

