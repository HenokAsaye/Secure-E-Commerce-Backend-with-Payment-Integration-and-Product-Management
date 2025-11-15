import express from "express";
import {Router} from "express";
import { createPaymentSession,savePayment,handleWebhooks } from "../controllers/paymentController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/create-session",authenticateToken,async(req,res)=>{
    const {order,items} = req.body;
    try {
        const sessionURL = createPaymentSession(order,items)
        res.statusCode(200).json({success:true,message:"Payment Succeeded!",sessionURL:sessionURL})
    } catch (error) {
        res.status(500).json({success:false,message:"Failed create Payment session",sessionURL:sessionURL})
    }
}
)

router.post("/savePayment",authenticateToken,savePayment);
router.post("/handleWebhooks",authenticateToken,express.raw({type:'application/json'}),handleWebhooks);
router.get("/test-stripe", async (req, res) => {
    try {
        const balance = await stripe.balance.retrieve();
        res.status(200).json({ success: true, balance });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


export default router;


