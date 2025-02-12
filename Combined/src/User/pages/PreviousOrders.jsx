import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";

const PreviousOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token"); // Assuming authentication uses JWT
                const response = await axios.get(`${backendUrl}/api/order/myorders`, {
                    headers: { token: token }
                });
                setOrders(response.data.historyOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending": return "text-yellow-500";
            case "rejected":
            case "cancelled": return "text-red-500";
            case "completed":
            case "delivered": return "text-green-500";
            default: return "text-gray-500";
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            console.log(orderId);
            
            const response = await axios.post(`${backendUrl}/api/order/cancel/${orderId}`, {},{
                headers: { token: token }
            });
            console.log(response);
            
            if (response.data.success) {
                setOrders(orders.map(order => 
                    order._id === orderId ? { ...order, status: "cancelled" } : order
                ));
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
        }
    };

    if (loading) return <p>Loading orders...</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Previous Orders</h2>
            {orders.length === 0 ? (
                <p>No previous orders found.</p>
            ) : (
                <div className="grid gap-4">
                    {orders.map(order => (
                        <div key={order._id} className="border p-4 rounded-lg shadow-md bg-white">
                            <h3 className="text-lg font-semibold">Shop: {order.adminId.shopName}</h3>
                            <p className="text-gray-500">{order.adminId.address}</p>
                            <p className="font-medium">Order Type: {order.orderType}</p>
                            <p className={"text-sm font-semibold " + getStatusColor(order.status)}>
                                Status: {order.status}
                            </p>
                            <p className="font-medium">Total: ₹{order.total}</p>
                            <p className="text-sm text-gray-400">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
                            <div className="mt-2">
                                {order.items.map(item => (
                                    <div key={item.productId._id} className="flex items-center gap-2">
                                        <img src={item.productId.image} alt={item.productId.name} className="w-12 h-12 object-cover rounded" />
                                        <div>
                                            <p className="font-medium">{item.productId.name}</p>
                                            <p className="text-sm">₹{item.productId.price} x {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            { order.status === "pending" && (
                                <button 
                                    onClick={() => handleCancelOrder(order._id)} 
                                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PreviousOrders;
