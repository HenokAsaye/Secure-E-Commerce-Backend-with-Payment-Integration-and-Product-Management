import {
  createOrder,
  orderDetail,
  userOrderhistory,
  cancelOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import Order from "../models/order.js";

import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { Router } from "express";
const router = Router();

router.post("/createorder", authenticateToken, createOrder);
router.get("/orderdetail", authenticateToken, authorizeRoles, orderDetail);
router.patch(
  "/updateorderstatus",
  authenticateToken,
  authorizeRoles,
  updateOrderStatus
);
router.delete("/cancelorder", authenticateToken, cancelOrder);
router.get("/orderhistory", authenticateToken, userOrderhistory);
router.get(
  "/allorders",
  authenticateToken,
  authorizeRoles("admin"), // <-- FIX
  async (req, res) => {
    try {
      const orders = await Order.find().select(
        "_id user orderStatus paymentStatus totalAmount"
      );
      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error("Failed to fetch all orders:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

export default router;
