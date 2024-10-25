import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import { json } from "express";
import adminModel from '../models/adminModel.js'




// function for add product 
const addProduct = async (req, res) => {
    try {
      const { name, description, category, price, bestseller } = req.body;
      const image1 = req.files.image && req.files.image[0];
      const ID = req.adminID;
  
      const admin = await adminModel.findById(ID);
      if (!admin) {
        return res.json({ message: 'Admin not found' });
      }
  
      // Resize image to 172x172 pixels using Cloudinary transformations
      const imageUrl = await cloudinary.uploader.upload(image1.path, {
        resource_type: "image",
        width: 172,
        height: 172,
        crop: "pad", // Maintains aspect ratio and adds padding if needed
        background: "white" // Adds white padding for any empty space
      }).then((result) => result.secure_url);
  
      console.log(name, description, category, price, bestseller, admin.shopName);
  
      const productData = {
        name,
        description,
        category,
        price: Number(price),
        bestseller: bestseller === "true",
        image: imageUrl,
        shopName: admin.shopName,
        adminId: ID,
        date: Date.now()
      };
  
      console.log(productData);
  
      const product = new productModel(productData);
      await product.save();
      res.json({ success: true, message: "Product Added" });
  
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };

//function for listing products
const listProductAdmin =async (req,res) =>  {
    const ID = req.adminID
       // console.log(req.adminID);
        
        const admin = await adminModel.findById(ID);
    if (!admin) {
      return res.json({ message: 'Admin not found' });
    }
    try {
        const products =await productModel.find({adminId : ID });
        res.json({success:true,products})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }

}

//function for removing product
const removeProduct =async (req,res) =>  {
    try {
        const product_Id = req.body.id;
        console.log(product_Id);
        
        await productModel.findByIdAndDelete(product_Id)
        res.json({success:true,message:"Product Removed"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message:error.message});
        }
        
    }


//function for singlr product info
const singleProduct =async (req,res) =>  {
   try {
    const { product_Id } =req.body
    const product = await productModel.findById(product_Id)
    res.json(product)
   } catch (error) {
    res.json(error.message)
   }
}

const listProduct =async (req,res) =>  {

    try {
        const products =await productModel.find({});
        res.json({success:true,products})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }

}
export  { addProduct, listProduct, listProductAdmin , removeProduct, singleProduct}