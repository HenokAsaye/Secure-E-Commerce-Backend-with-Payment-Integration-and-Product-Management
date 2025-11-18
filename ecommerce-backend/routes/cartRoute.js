import {
  addToCart,
  updateCart,
  deleteProduct,
  deleteUserCart,
  getUserCart,
} from "../controllers/cartController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { Router } from "express";
import {
  addToCart,
  updateCart,
  deleteProduct,
  deleteUserCart,
  getUserCart,
} from "../controllers/cartController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { Router } from "express";
const router = Router();

router.post("/addtocart", authenticateToken, addToCart);
router.get("/seecart/:userId", authenticateToken, getUserCart);
router.delete("/deletecart", authenticateToken, deleteUserCart);
router.delete(
  "deleteproduct",
  authenticateToken,
  authorizeRoles,
  deleteProduct
);
router.patch("/updatecart", authenticateToken, updateCart);

export default router;
