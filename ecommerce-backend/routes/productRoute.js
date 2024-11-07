import {Router} from "express";
import {createProduct,getProduct,editProduct,deleteProduct} from "../controllers/paymentController.js";
import { authenticateToken,authorizeRoles } from "../middlewares/authMiddleware.js";
const router = Router();


router.post("/createProduct",authenticateToken,authorizeRoles,createProduct);
router.get("/products",authenticateToken,getProduct);
router.patch("/editproduct",authenticateToken,authorizeRoles,editProduct);
router.delete("/deleteProduct",authenticateToken,authorizeRoles,deleteProduct);


export default router;
