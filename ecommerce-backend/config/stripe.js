import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.STRIPE_KEY;

if (!secretKey) {
    throw new Error("STRIPE_KEY is not defined in environment variables");
}

export const stripe = new Stripe(secretKey, {
    apiVersion: '2023-10-16',
});

export const testStripeConnection = async () => {
    try {
        const balance = await stripe.balance.retrieve();
        console.log("Stripe connection successful:", balance);
        return true;
    } catch (error) {
        console.error("Stripe connection failed:", error.message);
        return false;
    }
};






