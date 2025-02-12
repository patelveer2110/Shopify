import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";

const HistoryOrders = () => {
  const [historyOrders, setHistoryOrders] = useState([]);

  const fetchHistoryOrders = async () => {
    const token = localStorage.getItem('token_admin');
    if (!token) {
      toast.error("Unauthorized: No token provided");
      return;
    }

    try {
      console.log(token);
      
      const response = await axios.get(`${backendUrl}/api/order/history-order`, {
        headers: { token_admin: token },
      });
      console.log(response.data.message);
      

      if (response.data.success) {
        setHistoryOrders(response.data.historyOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch order history");
    }
  };

  useEffect(() => {
    fetchHistoryOrders();
  },[]); // Dependency added for re-fetching if token changes

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Order History</h2>

      {historyOrders.length === 0 ? (
        <p className="text-gray-500">No historical orders found.</p>
      ) : (
        <div className="space-y-4">
          {historyOrders.map((order) => {
            let bgColor = "";
            switch (order.status) {
              case "completed":
                bgColor = "bg-green-100 border-green-500";
                break;
              case "rejected":
                bgColor = "bg-red-100 border-red-500";
                break;
              case "cancelled":
                bgColor = "bg-yellow-100 border-yellow-500";
                break;
              default:
                bgColor = "bg-white";
            }

            return (
              <div
                key={order._id}
                className={`border p-4 rounded-lg shadow-sm ${bgColor}`}
              >
                <p className="text-gray-700">
                  <b>Customer:</b> {order.userId?.name} ({order.userId?.email})
                </p>
                {order.cartItems?.map((item, index) => (
                  <div key={index} className="mt-2 p-2 border-l-4 border-gray-300">
                    <p><b>Product:</b> {item.productId?.name || "Unknown"}</p>
                    <p><b>Price:</b> ₹{item.productId?.price || "N/A"}</p>
                    <p><b>Quantity:</b> {item.quantity}</p>
                  </div>
                ))}
                <p className="mt-2"><b>Order Type:</b> {order.orderType}</p>
                {order.orderType === "delivery" && (
                  <p><b>Address:</b> {order.address}</p>
                )}
                <p><b>Status:</b> {order.status}</p>
                <p><b>Total amount:</b> ₹{order.total}</p>
                <p><b>Completed At:</b> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryOrders;
