import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import { json } from "express";



// function for add product 
const addProduct = async (req,res) =>  {
    try {
        const {name, description, category, price, bestseller } =req.body;
        const image1 =  req.files.image && req.files.image[0];
        //const image2 = req.files.image && req.files.image[0];
        
       let imageUrl= await (await (cloudinary.uploader.upload(image1.path,{resource_type:"image"}))).secure_url
        console.log(name, description, category, price, bestseller);
        // console.log(image1);
        // console.log(imageUrl);
        
        const productData = {
            name,
            description,
            category,
            price : Number(price),
            bestseller: bestseller==="true"?true:false,
            image : imageUrl,
            date: Date.now()
        }

        console.log(productData);
        
        const product = new productModel(productData);
        await product.save();
        res.json({success:true,message:"Product Added"})
        
        
    } catch (error) {
        res.json({success:false, message:error.message})
        
    }
}

//function for listing products
const listProduct =async (req,res) =>  {
    try {
        const products =await productModel.find({});
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


export  { addProduct, listProduct, removeProduct, singleProduct}