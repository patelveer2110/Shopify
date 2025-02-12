import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import adminRouter from "./routes/adminRoute.js";
import productRouter from './routes/productRoute.js'
import orderRouter from './routes/orderRoute.js'
import cartRouter from './routes/cartRoute.js'

//App Config
const app=express()
const port =process.env.PORT || 4000
connectDB()
connectCloudinary()

//middleware
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/product',productRouter)
app.use('/api/order',orderRouter)
app.use('/api/cart',cartRouter)

app.get('/',(req,res)=>{                                                                                                                                                                                                                                                                                                                                                                                                                                                
    res.send("API Working")
})

app.listen(port, ()=>console.log("Server started onthe port : "+port)) 