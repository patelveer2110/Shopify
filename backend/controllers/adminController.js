import adminModel from "../models/adminModel.js";
import productModel from "../models/productModel.js";
import validator from "validator"
import bcrypt from "bcrypt";
import express from "express" 
import jwt from "jsonwebtoken";

const createToken = (adminId) => {
        return jwt.sign({id : adminId } , process.env.JWT_SECRET);
}

const adminLogin = async (req, res) => {
    try {
        const{email, password}= req.body;

        const admin =await adminModel.findOne({email});

        if(!admin){
                return res.json({success : false, message:"Admin doesnt exist"})
        }
        const isMatch = await bcrypt.compare(password, admin.password);

        if(isMatch){
                const token_admin =createToken(admin._id)
                res.setHeader("token_admin", token_admin);
                res.json({success:true,token_admin})
        }
        else{
                res.json({success:false, message:"Invalid creditials"})
        }
} catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
}
}

const adminRegister = async (req,res) => {
    
        try {
          const { name, email, password, shopName, address, contactNumber } = req.body;
     // res.json(email)
     console.log(email);
     
          // Check if admin already exists
          const exists = await adminModel.findOne({email})
          if (exists) {
                  return res.json({ success: false, message: "User already exists" })
          }

          //validating email format and password

          if (!validator.isEmail(email)) {
                  return res.json({ success: false, message: "Please enter valid email." });
          }
          if (password.length < 8) {
                  return res.json({ success: false, message: "Please enter Strong password." });
          }

      
          // Encrypt password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
      
          // Create new admin
          const newAdmin = new adminModel({
            name,
            email,
            password: hashedPassword,
            shopName,
            address,
            contactNumber,
            shopStatus : true,
          });
      
          const admin = await newAdmin.save();

          const token_admin = createToken(admin._id)
          res.setHeader("token_admin", token_admin);

          res.json({ success: true, token_admin , message:'Admin Regisetered successfully' });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message })
        }
          
}


// Update shop status
const updateShopStatus = async (req, res) => {
  try {
    const adminId = req.adminID; // Assuming `req.adminID` is available through middleware
    const { shopStatus } = req.body; // Shop status coming from the frontend

    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }
    console.log(shopStatus);
    
    // Update the shop status
    admin.shopStatus = shopStatus;
    await admin.save();

    res.json({ success: true, message: "Shop status updated", shopStatus });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get shop status (optional)
const getShopStatus = async (req, res) => {
  try {
    const adminId = req.adminID;
    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    res.json({ success: true, shopStatus: admin.shopStatus });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Fetch shop status by shopId (adminId)
// const getShopStatusByAdminId = async (req, res) => {
//   try {
//     const { adminId } = req.params;

//     const admin = await adminModel.findById(adminId);  // Find admin using shopId (adminId)
//     if (!admin) {
//       return res.json({ success: false, message: "Shop not found" });
//     }

//     // Return the shop status
//     res.json({ success: true, shopStatus: admin.shopStatus });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };



const adminDetails =  async (req, res) => {
  try {
    const adminId = req.adminID; // Retrieve the admin ID from token or request, if applicable
    const admin = await adminModel.findById(adminId); // Exclude password for security

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};


// controllers/adminController.js


// Update Admin Details
const updateAdminDetails = async (req, res) => {
    const { name, email, shopName, address, contactNumber, shopStatus } = req.body;
    const adminId = req.adminID; // Assuming you store admin ID in req.adminId from middleware

    try {
        // Find the admin by ID and update the details
        const updatedAdmin = await adminModel.findByIdAndUpdate(
            adminId,
            {
                name,
                email,
                shopName,
                address,
                contactNumber,
                shopStatus,
            },
            { new: true } // Return the updated document
        );

        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: 'Admin not found.' });
        }

        // Update all products associated with this admin's shop
        await productModel.updateMany(
            { adminId }, // Assuming products have an adminId field to relate to the admin
            {
                shopName: updatedAdmin.shopName,
                shopAddress: updatedAdmin.address, // Assuming there's a field for address in Product
            }
        );

        res.status(200).json({
            success: true,
            message: 'Admin details updated successfully, and products updated.',
            admin: updatedAdmin,
        });
    } catch (error) {
        console.error('Error updating admin details:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};





export { adminLogin, adminRegister, updateShopStatus, getShopStatus,adminDetails, updateAdminDetails };