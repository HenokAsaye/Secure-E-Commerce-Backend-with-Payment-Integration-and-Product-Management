import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import {User} from "../models/user.js";
import {sendPasswordResetEmail,sendVerificationEmail,PasswordResetSuccessEmail,sendWelcomeEmail} from "../MailTrap/email.js";
import {generateTokenandsetCookie} from "../utils/jwt.js";
dotenv.config();


export const signup = async(req,res)=>{
    const {username,email,role,password} = req.body
    try {
        if(!username || !email){
            return res.status(400).json({message:"All fields are required!"})
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(404).json({success:false,message:"user not found!"});
        }
        const hashed = await bcrypt.hash(password,10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        const newUser = new User({
            username:username,
            email:email,
            password:hashed,
            verificationToken:verificationToken,
            verificationTokenExpiresAt:Date.now() + 24 * 60 * 60 * 1000
        })
        await newUser.save()
        await generateTokenandsetCookie(res,newUser._id);
        await sendWelcomeEmail(newUser.email)
        return res.status(201).json({
            sucess:true,
            massage:"Account created Successfully!",
            user:{
                ...newUser._doc,
                password:undefined
            }
        })
   

    } catch (error) {
        throw Error(" failed to create Account!",error)
    }
};