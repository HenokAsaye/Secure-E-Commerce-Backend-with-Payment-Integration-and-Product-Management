import {createOrder,orderDetail,userOrderHistory,cancelOrder,updateOrderStatus} from "../controllers/orderController.js";
import { authenticateToken,authorizeRoles } from "../middlewares/authMiddleware.js";
import {Router} from "express";
const router  = Router();


router.post("/createorder",authenticateToken,createOrder);
router.get("/orderdetail",authenticateToken,authorizeRoles,orderDetail);
router.patch("/updateorderstatus",authenticateToken,authorizeRoles,updateOrderStatus);
router.delete("/cancelorder",authenticateToken,cancelOrder);
router.get("/orderhistory",authenticateToken,userOrderHistory);

export default router;