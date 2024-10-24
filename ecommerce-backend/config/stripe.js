import stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.STRIPE_KEY
export const stripe = stripe(secretKey);





