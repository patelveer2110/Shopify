import jwt from "jsonwebtoken";

const   adminAuth =async (req,res,next) => {
    try {
        
        const {token_admin}=req.headers
        //console.log("fd"+token_admin);
        
        //console.log("vc"+token_admin);
        
        if (!token_admin) {
            return res.json({success:false,token:token_admin,message:"Not Authorized Login Again"})
        }
        const token_decode=jwt.verify(token_admin,process.env.JWT_SECRET)
        // if (token_decode!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD) {
        //     return res.json({success:false,message:"Not Authorized Login Again"})
        // }
        if (!token_decode || !token_decode.id) {
            return res.status(401).json({ success: false, message: "Not Authorized, Invalid Token" });
        }
        // console.log("Aa");
        
        console.log(token_decode);
        
        req.adminID=token_decode.id;
        next()
    } catch (error) {

        res.json({success:false,message:error.message})
    }
}

export default adminAuth