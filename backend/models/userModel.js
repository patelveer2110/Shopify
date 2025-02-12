import mongoose from "mongoose";
import cartModel from "./cartModel.js";

const userSchema = new mongoose.Schema({
    name:{type:String, required: true},
    email:{type:String, required: true, unique:true},
    password:{type:String, required:true},
    contactNumber: { type: String },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },  // Reference to the Cart model
    /*cartData: {type:Object, defauly:{}} 
    remove  minimize if you remove cart function and then try it work or not*/
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;