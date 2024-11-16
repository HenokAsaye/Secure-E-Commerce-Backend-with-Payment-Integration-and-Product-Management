import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

export const generateTokenandsetCookie = async(res,userId)=>{
    const token = jwt.sign({_id:userId,role:user.role},process.env.JWT_KEY,{
        expires:"7d"
    })
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
    });
    return token;

};