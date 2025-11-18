import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/user.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  PasswordResetSuccessEmail,
  sendWelcomeEmail,
} from "../MailTrap/email.js";
import { generateTokenandsetCookie } from "../utils/jwt.js";
import { logger } from "../config/logger.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  PasswordResetSuccessEmail,
  sendWelcomeEmail,
} from "../MailTrap/email.js";
import { generateTokenandsetCookie } from "../utils/jwt.js";
import { logger } from "../config/logger.js";
dotenv.config();

export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    if (!username || !email || !password) {
      logger.info("all fields must be filled");
      return res
        .status(400)
        .json({ success: false, message: "fill all the required filled" });
    }
    const findUser = await User.findOne({ email });
    if (findUser) {
      logger.info("account already created");
      return res
        .status(400)
        .json({ success: false, message: "You have already have an Account!" });
    }
export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    if (!username || !email || !password) {
      logger.info("all fields must be filled");
      return res
        .status(400)
        .json({ success: false, message: "fill all the required filled" });
    }
    const findUser = await User.findOne({ email });
    if (findUser) {
      logger.info("account already created");
      return res
        .status(400)
        .json({ success: false, message: "You have already have an Account!" });
    }

    const isadminRequest = role === "admin";
    const canRegisterAsAdmin = process.env.ADMIN_EMAIL;
    if (isadminRequest && !canRegisterAsAdmin) {
      logger.warn("UnAuthorized to be Admin");
      return res
        .status(403)
        .json({ success: false, message: "you are not Admin!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 * Math.random() * 900000
    ).toString();
    const newUser = new User({
      username: username,
      email: email,
      password: hashPassword,
      role: isadminRequest && canRegisterAsAdmin ? "admin" : role,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await newUser.save();

    sendWelcomeEmail(newUser.email);
    return res.status(201).json({
      success: true,
      message: "registered successfully, please Sign IN",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    logger.error("Error while signing up", { error: error.stack });
    res.status(500).json({ success: false, message: "server-Error" });
  }
};
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      logger.warn("please try again the code is invailid or it is expired!");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    (user.isverified = true), (user.verificationToken = undefined);
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendVerificationEmail(user.email, user.username);
    logger.info(`user with email:${email} is verfied successfully`);
    (user.isverified = true), (user.verificationToken = undefined);
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendVerificationEmail(user.email, user.username);
    logger.info(`user with email:${email} is verfied successfully`);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    logger.error("failed to verify the email due to unkown server error", {
      error: error.stack,
    });
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
  } catch (error) {
    logger.error("failed to verify the email due to unkown server error", {
      error: error.stack,
    });
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ sucess: false, message: "user not found!" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ sucess: false, message: "Wrong Email or Password" });
    }
    await generateTokenandsetCookie(res, user);

    user.lastlogin = new Date();
    return res.status(200).json({
      sucess: true,
      message: "Loged in successFully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    logger.error("failed to login due to unkown error", { stack: error.stack });
    return res.status(500).json({ message: "server-error" });
  }
};

export const logOut = async (req, res) => {
  res.clearCookie("token");
  return res
    .status(200)
    .json({ sucess: true, message: "you have successfully logged out!" });
};
export const logOut = async (req, res) => {
  res.clearCookie("token");
  return res
    .status(200)
    .json({ sucess: true, message: "you have successfully logged out!" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.info(`user not found with email${email}`);
      return res.status(404).json({ sucess: true, message: "user not found!" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.info(`user not found with email${email}`);
      return res.status(404).json({ sucess: true, message: "user not found!" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CRYPTO_URL}/resetPassword/${resetToken}`
    );

    logger.info("Email sent SuccessFully!");
  } catch (error) {
    logger.error("There is unknown error");
    res.status(500).json({ sucess: false, message: "server-Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { code } = req.body;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: code,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: "invalid Token" });
    }
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await PasswordResetSuccessEmail(user.email);
    return res.status(200).json({
      success: true,
      message: "password reseted succesfully!",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server Error!" });
  }
};
