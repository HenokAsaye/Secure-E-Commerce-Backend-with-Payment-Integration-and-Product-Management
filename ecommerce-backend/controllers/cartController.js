import Product from "../models/product.js";
import User from "../models/user.js";

// Add to Cart Function
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const findProduct = await Product.findById(productId);
        if (!findProduct) {
            return res.status(404).json({ message: "Product not found!" });
        }

        // Check if product already exists in cart
        const existingProduct = user.cart.find(item => item.product.toString() === productId.toString());

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity: quantity });
        }

        await user.save();
        return res.status(200).json({ message: "Product added/updated successfully in the cart!" });

    } catch (error) {
        return res.status(500).json({ message: "Unknown error, please try again!", error: error.stack });
    }
};

// Update Cart Function
export const updateCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const findProduct = user.cart.find(item => item.product.toString() === productId.toString());
        if (!findProduct) {
            return res.status(404).json({ message: "Product not found in cart!" });
        }

        // Update quantity logic
        if (quantity > 0) {
            findProduct.quantity += quantity;
        } else if (findProduct.quantity >= Math.abs(quantity) && quantity < 0) {
            findProduct.quantity += quantity; // Subtracting
            if (findProduct.quantity === 0) {
                user.cart = user.cart.filter(item => item.product.toString() !== productId.toString());
            }
        } else {
            return res.status(400).json({ message: "Invalid quantity update!" });
        }

        await user.save();
        return res.status(200).json({ message: "Cart updated successfully!" });

    } catch (error) {
        return res.status(500).json({ message: "Unknown error, please try again!", error: error.stack });
    }
};

// Get User Cart
export const getUserCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        if (userId.toString() === req.user._id.toString()) {
            const userCart = findUser.cart;
            return res.status(200).json({ message: 'Here is the user cart', userCart });
        } else {
            return res.status(403).json({ message: "You are not authorized to see another person's cart!" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Unknown error, please try again!", error: error.stack });
    }
};

// Delete User Cart
export const deleteUserCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        if (userId.toString() === req.user._id.toString()) {
            findUser.cart = [];
            await findUser.save();
            return res.status(200).json({ message: "Cart deleted successfully!" });
        } else {
            return res.status(403).json({ message: "You are not authorized to perform this action!" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Unknown error, please try again!", error: error.stack });
    }
};

// Delete Specific Product from Cart
export const deleteProduct = async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;
    try {
        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        if (userId.toString() === req.user._id.toString()) {
            findUser.cart = findUser.cart.filter(item => item.product.toString() !== productId.toString());
            await findUser.save();
            return res.status(200).json({ message: "Product removed from cart successfully!" });
        } else {
            return res.status(403).json({ message: "You are not authorized for this task!" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Unknown error, please try again!", error: error.stack });
    }
};
