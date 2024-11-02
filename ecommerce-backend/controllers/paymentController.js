import stripe from "../config/stripe.js"
import dotenv from "dotenv";
import Payment from "../models/payment.js";
import Order from "../models/order.js";
dotenv.config()


export const createPaymentSession = async(req,res)=>{
    try{
        const {items} = req.body;
        const lineItems = items.map((item) =>({
            price_data:{
                currency:'usd',
                product_data:{
                    name:item.name
                },
                unit_amount:item.price * 100,
            },
            quantity:item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card','apple_pay','google_pay'],
            line_items:lineItems,
            mode:'payment',
            success_url:`${process.env.CLIENT_URL}/success?success_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.CLIENT_URL}/cancel`
        })

        return res.status(200).json({sucess:true,success_url:session.url})
    }catch(error){
        console.log("error when creating checkout session",error)
        return res.status(500).json({ success: false, message: "Failed to create checkout session" });
    }
}


export const savePayment = async(req,res)=>{
    const {orderId,userId,amount,paymentMethod,transactionId} = req.body;
    try {
        const payment = new Payment({
            order:orderId,
            user:userId,
            paymentMethod,
            Amount:amount,
            transactionId,
            status:'completed'
        });
        await payment.save()
        await Order.findByIdAndUpdate(orederID,{status:'paid'});
        res.status(200).json({sucess:true,message:"Payment recorded successfully",payment});
    } catch (error) {
        console.error("Error saving Payment",error);
        res.status(500).json({sucess:false,message:"Failed to save payment"});
    }
    
}