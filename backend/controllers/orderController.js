import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";

// Create order (single product or cart)
const createOrder = async (req, res) => {
    console.log("Request body:", req.body);

    // Extract the first order from the orders array (assuming only one order is passed)
    const { productId, adminId, orderType, mobileNumber, address, quantity,total } = req.body;
    // Accessing the first item in orders

    const userId = req.userId;  // Assuming userId is coming from middleware

    try {
        // Create a single order that includes all the items in the cart
        const newOrder = new orderModel({
            userId,
            adminId,
            orderType,
            mobileNumber,
            address,
            items: { productId, quantity },  // All items will be added in the 'items' field of the single order
            total
        });

        await newOrder.save();
        //console.log("d",newOrder);

        res.json({
            success: true,
            message: "Order placed successfully for Rs."+total,
            orderId: newOrder._id,  // Return the created order
        });

    } catch (error) {
        console.error("Error placing order:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const confirmOrder = async (req, res) => {
    //console.log("fdc x");

    const { cartId } = req.params;  // Order ID passed in the URL
    const { mobileNumber, address, orderType } = req.body;  // Data passed in the request body
    const userId = req.userId;  // Assuming userId is extracted from middleware (JWT token)

    try {
        // Find the order by ID
        //   const order = await orderModel.findById(orderId);
        //   if (!order) {
        //     return res.status(404).json({ success: false, message: "Order not found" });
        //   }

        //   // Check if the order belongs to the user

        //   // Check if the order is already confirmed
        //   if (order.status === "confirmed") {
        //     return res.status(400).json({ success: false, message: "Order is already confirmed" });
        //   }

        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        if (cart.userId.toString() !== userId) {
            console.log(userId);
            console.log(cart);

            return res.status(403).json({ success: false, message: "You can only confirm your own orders" });
        }

        // Update the order with the additional data
        //   order.status = "pending";
        //   order.mobileNumber = mobileNumber;  // Save mobile number
        //   order.address = address;  // Save address
        //   order.orderType = orderType;  // Save order type (e.g., 'takeaway', 'delivery')
        //   order

        const newOrder = new orderModel({
            userId,
            adminId: cart.adminId,
            items: cart.items,  // All items will be added in the 'items' field of the single order
            status: "pending",
            address,
            orderType,
            total:cart.total
        });

        // Save the updated order
        await newOrder.save();
        await cartModel.findByIdAndDelete(cartId);


        res.json({ success: true, message: "Order confirmed successfully for Rs."+cart.total, newOrder });
    } catch (error) {
        console.error("Error confirming order:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Fetch active orders (for admin)
const fetchOrders = async (req, res) => {
    const adminId = req.adminID;

    if (!adminId) {
        return res.status(400).json({ success: false, message: 'Admin ID is missing' });
    }

    try {
        // Fetch orders for the given admin, excluding specific statuses
        const orders = await orderModel.find({ 
            adminId, 
            status: { $nin: ['completed', 'cancelled', 'rejected','delivered'] } 
        })
        .populate('items.productId', 'name price image') // Populating productId within items
        .populate('userId', 'name email contactNumber'); // Populating userId for the customer details

        // console.log("Fetched Orders:", orders);

        // Send the orders as a response
        // console.log(orders.items);
        
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Fetch order history
const fetchHistoryOrders = async (req, res) => {
    const adminId = req.adminID;
    console.log("Admin ID:", adminId);
// console.log("Orders Schema:", await orderModel.findOne());

    try {
        const historyOrders = await orderModel.find({ adminId, status: { $in: ['completed', 'cancelled', 'rejected','delivered'] } })
            .populate('items.productId', 'name price')
            .populate('userId', 'name email');
            console.log(" nm  ",historyOrders);
            
        res.json({ success: true, historyOrders });
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({ success: false, message: error.message });
    }
};
const fetchHistoryOrdersUser = async (req, res) => {
    const userId = req.userID;
    // console.log("Admin ID:", userId);
// console.log("Orders Schema:", await orderModel.findOne());

    try {   
        const historyOrders = await orderModel.find( userId)
            .populate('items.productId', 'name price image')
            .populate('adminId', 'shopName address');
            // console.log(" nm  ",historyOrders);
            
        res.json({ success: true, historyOrders });
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        if (updatedOrder) {
            console.log(updateOrderStatus);
            
            res.json({ success: true, message: 'Order status updated', order: updatedOrder });
        } else {
            res.json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Approve order
const approveOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status: 'approved' },
            { new: true }
        );
        if (updatedOrder) {
            res.json({ success: true, message: 'Order approved', order: updatedOrder });
        } else {
            res.json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reject order
const rejectOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const rejectedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status: 'rejected' },
            { new: true }
        );
        res.json({ success: true, message: 'Order rejected', order: rejectedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        console.log("trefds");
        
        const { orderId } = req.params;
        const userId = req.userId; // Extract user ID from the token
        console.log("fds");
        
        // Find the order
        const order = await orderModel.findOne({ _id: orderId, userId });

        
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Allow cancellation only if the order status is "pending"
        if (order.status !== "pending") {
            return res.status(400).json({ success: false, message: "Order cannot be cancelled as it is not pending" });
        }

        // Update order status to "cancelled"
        order.status = "cancelled";
        console.log("  fd"+order);
        console.log("  fd"+order);
        console.log("  fd"+order);
        
        await order.save();

        res.json({ success: true, message: "Order cancelled successfully", order });
    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { createOrder, fetchOrders, fetchHistoryOrders, updateOrderStatus, approveOrder, rejectOrder, confirmOrder,fetchHistoryOrdersUser,cancelOrder };
