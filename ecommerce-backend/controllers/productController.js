import Product from "../models/product.js";
import { logger } from "../config/logger.js";
import User from "../models/user.js";
import fs from "fs";
import path from "path";

export const createProduct = async (req, res) => {
  const { name, stock, description, price, category } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      logger.info(`Unauthorized product creation attempt by user ${userId}`);
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create products" });
    }

    const images = req.files
      ? req.files.map((file) => `/uploads/products/${file.filename}`)
      : [];

    const newProduct = new Product({
      Name: name,
      stock,
      description,
      price,
      category,
      images,
    });

    await newProduct.save();
    logger.info(`New product created: ${newProduct._id}`);

    return res.status(201).json({
      success: true,
      message: "New product created successfully",
      product: newProduct,
    });
  } catch (error) {
    logger.error("Error creating product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server-Error", error: error.message });
  }
};

export const getProduct = async (req, res) => {
  const { name, category, page = 1, limit = 22 } = req.query;

  try {
    const query = {};
    if (name) query.Name = { $regex: name, $options: "i" };
    if (category) query.category = category;

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    logger.info("Products fetched successfully!");
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    logger.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server-Error" });
  }
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      logger.info(`Product with ID ${productId} not found`);
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    logger.info("Product details fetched successfully!");
    res.status(200).json({
      success: true,
      message: "Product data fetched successfully",
      product,
    });
  } catch (error) {
    logger.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Server-Error" });
  }
};

export const editProduct = async (req, res) => {
  const { description, price, stock, name, category } = req.body;
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      logger.info("Product not found");
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    if (name) product.Name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category) product.category = category;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );
      product.images = [...product.images, ...newImages];
    }

    product.updatedAt = Date.now();
    await product.save();

    logger.info(`Product with ID ${productId} updated successfully`);
    return res.status(200).json({
      success: true,
      message: "Product edited successfully",
      product,
    });
  } catch (error) {
    logger.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Server-Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      logger.info(`Product not found with ID ${productId}`);
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    product.images.forEach((imagePath) => {
      const fullPath = path.join(process.cwd(), imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await Product.findByIdAndDelete(productId);
    logger.info(`Product with ID ${productId} deleted successfully!`);
    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    logger.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server-Error" });
  }
};
