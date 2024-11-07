import { Router } from "express";
import { signup } from "../controllers/authController.js";
import { verifyEmail } from "../controllers/authController.js";
import { login } from "../controllers/authController.js";
import { logout } from "../controllers/authController.js";
import { resetPasswoerd } from "../controllers/authController.js";
import { forgotPassword } from "../controllers/authController.js";

const router = Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/verifyEmail",verifyEmail);
router.post("/forgotPassword",forgotPassword);
router.post("/resetPassword",resetPasswoerd);
router.post("/logout",logout);