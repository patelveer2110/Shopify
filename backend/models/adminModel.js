// models/Admin.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  shopName: { type: String, required: true },
  address: { type: String },
  contactNumber: { type: String },
  shopStatus : {type : Boolean},
  deliveryOption: { type: String, enum: ['delivery', 'takeaway'], required: true }
    // Add more fields as needed
  
});

const adminModel = mongoose.model.admin || mongoose.model('admin', AdminSchema);

export default adminModel;
