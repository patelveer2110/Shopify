import { log } from "console";
import mongoose from "mongoose";

const connectDB = async () => {


    mongoose.connection.on('connected', () => {
        console.log("DB conneccted");
        
    })


    await mongoose.connect(`${process.env.MONGODB_URL}/e-commerce`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 50000, // Increase to 50 seconds
        socketTimeoutMS: 45000           // Increase socket timeout if needed
      })
}

export default connectDB