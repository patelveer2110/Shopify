import express from 'express';
import { createOrder, fetchOrders, updateOrderStatus , fetchHistoryOrders ,approveOrder,rejectOrder,confirmOrder,cancelOrder,fetchHistoryOrdersUser} from '../controllers/orderController.js'; // Import the order controller functions
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js'; // Middleware to verify user/admin
const orderRouter = express.Router();

// Place an order (for a user)
orderRouter.post('/place-order', userAuth, createOrder);
orderRouter.post('/confirm/:cartId', userAuth,confirmOrder);
orderRouter.post("/cancel/:orderId", userAuth,cancelOrder);
orderRouter.get('/myorders', userAuth,fetchHistoryOrdersUser);

// View orders (admin only)
orderRouter.get('/view-orders', adminAuth, fetchOrders);
orderRouter.put('/update', adminAuth, updateOrderStatus); 
orderRouter.get('/history-order', adminAuth,fetchHistoryOrders);
orderRouter.post('/approve', adminAuth,approveOrder);
orderRouter.post('/reject', adminAuth,rejectOrder);
export default orderRouter;
