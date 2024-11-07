import { addToCart,updateCart,deleteProduct,deleteUserCart,getUserCart } from "../controllers/cartController";
import { authenticateToken,authorizeRoles } from "../middlewares/authMiddleware";
import {Router} from "express";
const router = Router();


router.post("/addtocart",authenticateToken,addToCart);
router.get("/seecart",authenticateToken,getUserCart);
router.delete('/deletecart',authenticateToken,deleteUserCart);
router.delete("deleteproduct",authenticateToken,authorizeRoles,deleteProduct);
router.patch("/updatecart",authenticateToken,updateCart);


export default router;