import Product from "../models/product.js";
import {logger} from "../config/logger.js";
import User from "../models/user.js";

export const createProduct = async (req, res) => {
    const { name, stock, description, price } = req.body;
    const { userId } = req.user;
    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.info(`User not found with ID ${userId}`);
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const newProduct = new Product({
            name,
            stock,
            description,
            price
        });

        await newProduct.save();
        logger.info("A new product is created successfully!");
        return res.status(201).json({
            success: true,
            message: "New product created successfully",
            product: { ...newProduct._doc }
        });
    } catch (error) {
        logger.error("Server error has occurred!");
        res.status(500).json({ success: false, message: "Server-Error" });
    }
};

export const getProduct = async (req, res) => {
    const { Name } = req.query;
    try {
        const product = await Product.find({Name:Name});
        if (!product) {
            logger.info(`Product with ID ${productId} not found`);
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        logger.info("Product details fetched successfully!");
        res.status(200).json({
            success: true,
            message: "Product data fetched successfully",
            product: { ...product._doc }
        });
    } catch (error) {
        logger.error("Server error has occurred!");
        res.status(500).json({ success: false, message: "Server-Error" });
    }
};

export const editProduct = async (req, res) => {
    const { description, price, stock } = req.body;
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            logger.info("Product not found");
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.updateAt = updateAt || product.updateAt;

        await product.save();
        logger.info(`Product with ID ${productId} updated successfully`);
        return res.status(200).json({
            success: true,
            message: "Product edited successfully",
            updatedProduct: { ...product._doc }
        });
    } catch (error) {
        logger.error("Server error has occurred!");
        res.status(500).json({ success: false, message: "Server-Error" });
    }
};

export const deleteProduct = async (req, res) => {
    const { productId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            logger.info(`Product not found with ID ${productId}`);
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        await Product.findByIdAndDelete(productId);
        logger.info(`Product with ID ${productId} deleted successfully!`);
        return res.status(200).json({ success: true, message: "Product deleted successfully!" });
    } catch (error) {
        logger.error("Server error has occurred!");
        res.status(500).json({ success: false, message: "Server-Error" });
    }
};
