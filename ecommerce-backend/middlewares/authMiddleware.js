import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();


export const authenticateToken = async(req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1]
    jwt.verify(token,process.env.JWT_KEY,async(err,decodeduser)=>{
        if(err){
            res.status(401).json({message:'InvalidToken',error:err.stack})
        }
        req.user = await User.findById(decodeduser._id)
        if(!req.user){
            res.status(404).json({message:"user not found!"})
        }
        next();
    })
}


export const authorizeRoles = (role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role)){
            return res.status(403).json({message:"Access Denied you are not admin of this page!" })
        }
        next()
    }
 
};