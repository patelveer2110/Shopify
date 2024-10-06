import express from "express"
import { adminLogin, adminRegister, updateShopStatus, getShopStatus } from "../controllers/adminController.js"
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post('/register',adminRegister)
adminRouter.post('/login',adminLogin)
adminRouter.get('/shop-status', adminAuth, getShopStatus);
adminRouter.post('/update-shop-status', adminAuth, updateShopStatus);


export default adminRouter;