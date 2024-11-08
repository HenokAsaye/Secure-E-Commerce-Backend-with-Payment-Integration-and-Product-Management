import passport from "passport"
import {strategy as GoogleStrtegy } from "passport-google-oauth20";
import {User} from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();


export const Passport = passport.use(
    new GoogleStrtegy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:"/auth/google/callback"
    },
    async(accessToken,refreshToken,profile,done)=>{
        let user =  await User.findOne({googleId:profile.id})
        try {
            if(!user){
                const user =  new User({
                    username:profiledisplayName,
                    email:profile.emails[0].value,
                    googleId:profile.id,
                    isverified:true
                })
            }
            done(null,user)
        } catch (error) {
            done(null,false)
        }

    }
    )
)