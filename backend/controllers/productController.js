import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import { json } from "express";
import adminModel from '../models/adminModel.js'




// function for add product 
const addProduct = async (req, res) => {
    try {
      const { name, description, category, price, inStock } = req.body;
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
        background: "white", // Adds white padding for any empty space
        quality: "auto:best",  // Automatically selects the best quality
        format: "jpg" 
      }).then((result) => result.secure_url);
  
      console.log(name, description, category, price, admin.shopName);
  
      const productData = {
        name,
        description,
        category,
        price: Number(price),
        shopAddress : admin.address ,
        image: imageUrl,
        shopName: admin.shopName,
        adminId: ID,
        date: Date.now(),
        inStock
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
const singleProduct = async (req, res) => {
  try {
    const { product_Id } = req.body;

    // Fetch product and populate admin contact number
    const product = await productModel.findById(product_Id)
    // Log product details for debugging
    console.log("Product details:", product);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.json({ success: false, message: error.message });
  }
};


const listProduct =async (req,res) =>  {

    try {
        const products =await productModel.find({}).populate("adminId",'contactNumber shopName address shopStatus deliveryOption');
        res.json({success:true,products})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }

}

const updateProduct = async (req, res) => {
  try {
    const { Id, name, description, category, price, inStock } = req.body;
    const updateData = { name, description, category, price, inStock };

    // Check if a new image is provided and process it with resizing and quality optimization
    if (req.files && req.files.image && req.files.image[0]) {
      const imagePath = req.files.image[0].path;

      // Upload image to Cloudinary with resizing and quality optimization
      const imageUrl = await cloudinary.uploader.upload(imagePath, {
        resource_type: "image",
        width: 172,
        height: 172,
        crop: "pad",
        background: "white",
        quality: "auto:best",  // Ensures high-quality output
        format: "jpg"
      }).then((result) => result.secure_url);

      updateData.image = imageUrl;  // Set the optimized image URL
    }

    // console.log("Received productId:", req.body.Id);
    // console.log("Received fields:", req.body);
    // console.log("Received files:", req.files);

    const updatedProduct = await productModel.findByIdAndUpdate(Id, updateData, { new: true });

    if (updatedProduct) {
      res.json({ success: true, message: 'Product Updated', product: updatedProduct });
    } else {
      res.json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export  { addProduct, listProduct, listProductAdmin , removeProduct, singleProduct, updateProduct}