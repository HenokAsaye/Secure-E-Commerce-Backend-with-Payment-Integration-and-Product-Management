import { Router } from "express";
import { createProduct, getProduct, getProductById, editProduct, deleteProduct } from "../controllers/productController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { uploadMultiple } from "../config/multer.js";

const router = Router();

router.post(
    "/createproduct",
    authenticateToken,
    authorizeRoles(['admin']),
    uploadMultiple,
    createProduct
);

router.get("/products", getProduct);
router.get("/product/:productId", getProductById);

router.patch(
    "/editproduct/:productId",
    authenticateToken,
    authorizeRoles(['admin']),
    uploadMultiple,
    editProduct
);

router.delete(
    "/deleteproduct/:productId",
    authenticateToken,
    authorizeRoles(['admin']),
    deleteProduct
);

export default router;
