import express from "express"
import { adminLogin, adminRegister, updateShopStatus, getShopStatus, adminDetails, updateAdminDetails } from "../controllers/adminController.js"
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post('/register',adminRegister)
adminRouter.post('/login',adminLogin)
adminRouter.get('/shop-status', adminAuth, getShopStatus);
adminRouter.get('/admindetail', adminAuth,adminDetails);
adminRouter.put('/update',adminAuth,updateAdminDetails);
adminRouter.post('/update-shop-status', adminAuth, updateShopStatus);
// adminRouter.post('/:adminId/status', getShopStatusByAdminId);


export default adminRouter;