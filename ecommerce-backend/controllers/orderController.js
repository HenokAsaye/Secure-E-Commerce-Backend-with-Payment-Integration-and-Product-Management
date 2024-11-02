import User from "../models/user.js";
import Payment from "../models/payment.js";
import Order from "../models/order.js";
import User from "../models/user.js";


export const createOrder = async(req,res)=>{
    try {
        const {userId,items,totalAmount} = req.body;
        const order = new Order({
            
        })
    } catch (error) {
        
    }
}