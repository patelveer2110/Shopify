import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import adminRouter from "./routes/adminRoute.js";
import productRouter from './routes/productRoute.js'

//App Config
const app=express()
const port =process.env.PORT || 4000
connectDB()
connectCloudinary()

//middleware
app.use(express.json())
app.use(cors(
    {origin: ["https://shopify-frontend-theta.vercel.app"], // Replace with your actual frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"], // Define the HTTP methods you allow
    allowedHeaders: ["Content-Type", "Authorization"], // Specify which headers you allow
    credentials: true}
))

//api endpoints
app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/product',productRouter)

app.get('/',(req,res)=>{                                                                                                                                                                                                                                                                                                                                                                                                                                                
    res.send("API Working")
})

app.listen(port, ()=>console.log("Server started onthe port : "+port)) 