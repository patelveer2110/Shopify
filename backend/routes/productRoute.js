import express from "express"
import upload from "../middleware/multer.js"
import {addProduct, listProductAdmin ,listProduct, removeProduct, singleProduct, updateProduct } from "../controllers/productController.js"
import adminAuth from "../middleware/adminAuth.js";

const productRouter =express.Router();

productRouter.post('/add',adminAuth, upload.fields([{ name: "image", maxCount: 1 }]), addProduct);
 productRouter.post('/remove',adminAuth,removeProduct)
 productRouter.post('/single',singleProduct)
 productRouter.get('/list',adminAuth,listProductAdmin) 
 productRouter.post('/update', upload.fields([{ name: "image", maxCount: 1 }]),updateProduct);
 productRouter.get('/listall',listProduct) 
 

export default productRouter
