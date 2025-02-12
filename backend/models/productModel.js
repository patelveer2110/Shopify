import mongoose from "mongoose";    

const productSchema = new mongoose.Schema({
    name:{type : String, required:true },
    description:{type : String, required:true },
    price:{type : Number, required:true },
    image:{type : String, required:true },
    category:{type : String, required:true },
     // Reference to the admin who added the product
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },
  // Store the shop name of the admin
  //shopName: { type: String , required: true },
  //shopAddress:{type:String, required:true},
    date:{type:Number, required:true},
    inStock: { type: Boolean, default: true }
})

const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel