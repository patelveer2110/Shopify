import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from '../../App';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token_admin');
            const response = await axios.get(`${backendUrl}/api/order/view-orders`, {
                headers: { token_admin: token }
            });

            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const approveOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token_admin');
            await axios.post(`${backendUrl}/api/order/approve`, { orderId }, {
                headers: { token_admin: token }
            });
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: "Approved" } : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const rejectOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token_admin');
            await axios.post(`${backendUrl}/api/order/reject`, { orderId }, {
                headers: { token_admin: token }
            });
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: "Rejected" } : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token_admin');
            const response = await axios.put(`${backendUrl}/api/order/update`, { orderId, status: newStatus }, {headers: { token_admin: token }});
            console.log(response.data.message);
            
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const filteredOrders = orders.filter((order) =>
        filter === "all" ? true : order.status === filter
    );

    const searchedOrders = filteredOrders.filter((order) =>
        (order.userId && order.userId.name.toLowerCase().includes(search.toLowerCase())) ||
        (order._id && order._id.includes(search))
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen mt-14">
            <h1 className="text-2xl font-semibold mb-4">Admin Order Management</h1>
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by ID or Name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded w-1/3"
                />
                <select
                    className="p-2 border rounded"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>

            <div className="flex flex-col gap-4">
                {searchedOrders.map((order) => (
                    <div
                        key={order._id}
                        className={`bg-white shadow-md rounded-lg p-4 flex flex-col gap-4 ${order.deliveryType === 'delivery'
                                ? 'bg-blue-100'
                                : order.deliveryType === 'takeaway'
                                    ? 'bg-yellow-100'
                                    : order.status === 'approved'
                                        ? 'border-green-400'
                                        : order.status === 'rejected'
                                            ? 'border-red-400'
                                            : order.status === 'pending'
                                                ? 'border-yellow-400'
                                                : order.status === 'shipped'
                                                    ? 'border-blue-400'
                                                    : 'border-gray-300'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Order ID: {order._id}</h3>
                                <p
                                    className={`text-sm font-medium ${order.status === "approved"
                                            ? "text-green-600"
                                            : order.status === "rejected"
                                                ? "text-red-600"
                                                : order.status === "pending"
                                                    ? "text-yellow-600"
                                                    : order.status === "shipped"
                                                        ? "text-blue-600"
                                                        : ""
                                        }`}
                                >
                                    Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">{order.userId ? order.userId.name : "Unknown User"}</p>
                            </div>
                        </div>

                        {/* Address and Contact Information */}
                        <div className="flex flex-col gap-2">
                            <div>
                                <b>Address:</b> {order.address}
                            </div>
                            <div>
                                <b>Contact Number:</b> {order.userId.contactNumber}
                            </div>
                        </div>

                        {/* Delivery Type */}
                        <div className="flex justify-between mt-4">
                            <div>
                                <b>Delivery Type:</b> {order.orderType}
                            </div>
                            <div>
                                <p className="text-sm font-semibold">₹{order.total}</p>
                            </div>
                        </div>

                        {/* Display items if the order is approved */}
                        {order.items && order.items.length > 0 && (
                            <div>
                                <b>Items:</b>
                                <div className="flex flex-col gap-2 mt-2">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-4">
                                            <img
                                                src={item.productId.image} // Assuming the image URL is stored in the 'image' field of product
                                                alt={item.productId.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div>
                                                <p><strong>Product:</strong> {item.productId.name}</p>
                                                <p><strong>Price:</strong> ₹{item.productId.price}</p>
                                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Total Section with Larger Text */}
                        <div className="mt-4 text-xl font-semibold text-gray-700">
                            <b>Total Amount:</b> ₹{order.total}
                        </div>

                        <div className="flex gap-2 mt-4">
                            <span
                                className={`px-3 py-1 text-sm rounded ${order.status === "pending"
                                        ? "bg-yellow-300"
                                        : order.status === "approved"
                                            ? "bg-green-300"
                                            : order.status === "rejected"
                                                ? "bg-red-300"
                                                : order.status === "shipped"
                                                    ? "bg-blue-300"
                                                    : "bg-gray-300"
                                    }`}
                            >
                                {order.status}
                            </span>

                            {/* Display buttons based on deliveryType */}
                            {order.deliveryType === 'delivery' && (
                                <button
                                    onClick={() => updateOrderStatus(order._id, "delivered")}
                                    className="px-3 py-1 bg-green-500 text-white rounded"
                                >
                                    Mark as Delivered
                                </button>
                            )}
                            {order.deliveryType === 'takeaway' && (
                                <button
                                    onClick={() => updateOrderStatus(order._id, "picked-up")}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                                >
                                    Mark as Picked Up
                                </button>
                            )}

                            {/* Order Status Buttons */}
                            {order.status === "pending" && (
                                <>
                                    <button
                                        onClick={() => approveOrder(order._id)}
                                        className="px-3 py-1 bg-green-500 text-white rounded"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => rejectOrder(order._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}

                            {order.status === "approved" && (
                                <button
                                    onClick={() => updateOrderStatus(order._id, "shipped")}
                                    className="px-3 py-1 bg-blue-500 text-white rounded"
                                >
                                    Ship
                                </button>
                            )}

                            {order.status === "shipped" && (
                                <button
                                    onClick={() => updateOrderStatus(order._id, "delivered")}
                                    className="px-3 py-1 bg-green-500 text-white rounded"
                                >
                                    Deliver
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Order;
