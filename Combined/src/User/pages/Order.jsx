import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import axios from "axios";

const Order = ({ token }) => {
  const { cartId } = useParams();
  const [address, setAddress] = useState("");
  const [orderType, setOrderType] = useState("takeaway");
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/cart/items`, {
          headers: { token },
        });

        if (response.data.success) {
          // Filter only in-stock items
          const inStockItems = response.data.carts.flatMap(cart => 
            cart.items.filter(item => item.productId.inStock)
          );
          console.log(inStockItems);
          
          setCart(inStockItems);
        } else {
          toast.error("Failed to fetch cart items");
        }
      } catch (error) {
        toast.error("Error fetching cart items");
      }
    };

    fetchCartItems();
  }, [cartId, token]);

  const confirmOrder = async () => {
    if (!cartId) {
      toast.error("Order ID is missing.");
      return;
    }

    const orderData = {
      address: orderType === "delivery" ? address : "", // Include address only if delivery
      orderType,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/confirm/${cartId}`,
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        navigate("/cart");
        toast.success("Order confirmed successfully");
      } else {
        toast.error(response.data.message || "Failed to confirm order");
      }
    } catch (error) {
      toast.error("Error confirming order");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Order Details</h1>

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Order Type</label>
        <div className="flex items-center">
          <input
            type="radio"
            id="takeaway"
            name="orderType"
            value="takeaway"
            checked={orderType === "takeaway"}
            onChange={(e) => setOrderType(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="takeaway" className="mr-4">Takeaway</label>

          <input
            type="radio"
            id="delivery"
            name="orderType"
            value="delivery"
            checked={orderType === "delivery"}
            onChange={(e) => setOrderType(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="delivery">Delivery</label>
        </div>
      </div>

      {orderType === "delivery" && (
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your address"
          />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cart Items</h2>
        {cart.length > 0 ? (
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.productId._id} className="border p-3 rounded-md">
                <p><strong>{item.productId.name}</strong></p>
                <p>Price: ₹{item.productId.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total: ₹{item.productId.price * item.quantity}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No items in the cart</p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={confirmOrder}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Order;
