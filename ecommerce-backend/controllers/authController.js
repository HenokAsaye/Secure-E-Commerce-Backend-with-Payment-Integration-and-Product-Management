import User from "../models/user.js"
import { generatewebtoken } from "../utils/jwt.js";
import bcrypt from "bcrypt";


export const signup = async (req,res)=>{
    const {username,email,password,role} = req.body

    try{
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            username:username,
            email:email,
            password:hashedPassword,
            role:role
        })
        const user = await newUser.save();
        const token = generatewebtoken(user);
        return res.status(201).json({message:"welcome you have signedup successfully",token:token})
    }catch(error){
        res.status(500).json({message:"unkown sweerver error,please try Again",error:error.stack})

    }
}


export const login = async(req,res)=>{
    const {email,password,role} = req.body
    try{
        const findUser = await User.findOne({email:email})
        if(!findUser){
            return res.status(404).json({message:"user not found!"})
        }
        const verifyUser = await bcrypt.compare(password,User.password);

        if(!verifyUser){
            return res.status(403).json({message:"Incorrect passowrd or Email,Please Try Again!"})
        }
        const token = generatewebtoken(findUser);
        if(role === 'admin'){
            return res.status(200).json({message:"Welcome Admin!",token:token})
        }
        return res.status(200).json({message:" you have successfully loged in!",token:token})
    }catch(error){
        res.status(500).json({message:"unkown Error,Please try Again!"})
    }
}
