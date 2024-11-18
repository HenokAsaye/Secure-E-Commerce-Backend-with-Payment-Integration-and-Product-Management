import {logger} from "../config/logger.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const findProduct =  await Product.findById(productId);
        if(!findProduct){
            return res.status(404).json({success:false,message:"product not found"})
        }
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $setOnInsert:{cart:[]},
                $inc:{"cart.$[elem].quantity":quantity}
            },
            {
                arrayFilters:[{"elem.product":productId}],
                new:true,
                upsert:true
            }
        );

        if(!user){
            return res.status(404).json({Sucess:false,message:"User not found!"})
        }
        await user.save();
        return res.status(200).json({sucess:true,message:"Product Added to the Cart Successfully!"})
    } catch (error) {
        return res.status(500).json({ message: "Unknown error, please try again!"});
    }
};


export const updateCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        if (quantity === 0) {
            return res.status(400).json({ message: "Quantity cannot be zero!" });
        }
        const update = quantity >0
        ?{$inc:{'cart.$[elem].quantity':quantity}}
        :{
            $pull:{cart:{product:productId}},
            $set:{"cart.$[elem].quantity":{$gte:quantity(quantity)}},
        };


        const user =  await User.findByIdAndUpdate(
            req.user._id,
            update,
            {
                arrayFilters:[{"elem.product":productId}],
                new:true
            }
        );

        if(!user){
            return res.status(404).json({success:true,message:"user not found"})
        }
       return res.status(200).json({message:"Cart Upadetes successfully!"})
    } catch (error) {
        console.error("Error updating cart:", error); 
        return res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
    }
};



export const getUserCart = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10} = req.query
    try {
        const findUser = await User.findById(userId,{cart:{$slice:[(page - 1) * limit,limit]}});
        if(!findUser){
            return res.status(404).json({message:"User not found!"})
        }
        if (userId.toString() !== req.user._id.toString() || findUser.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized access to another user's cart!" });
        }
        return res.status(200).json({sucess:true,message:"UnAuthorized access to another user's cart!"});
    } catch (error) {
        return res.status(500).json({ message: "Unknown error, please try again!"});
    }
};


export const deleteUserCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        if (userId.toString() === req.user._id.toString() || findUser.role === 'admin') {
            findUser.cart = [];
            await findUser.save();
            return res.status(200).json({ message: "Cart deleted successfully!" });
        } else {
            return res.status(403).json({ message: "You are not authorized to perform this action!" });
        }

    } catch (error) {
        log.error("error to delete user cart")
        return res.status(500).json({ message: "Unknown error, please try again!", error: error.stack });
    }
};


export const deleteProduct = async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;
    try {
        const findUser = await User.findById(userId);
        if (!findUser) {
            log.info(`user with id ${userId} not found`)
            return res.status(404).json({ message: "User not found!" });
        }
        if (userId.toString() === req.user._id.toString() || authorizeRoles(findUser.role)) {
            findUser.cart = findUser.cart.filter(item => item.product.toString() !== productId.toString());
            await findUser.save();
            return res.status(200).json({ message: "Product removed from cart successfully!" });
        } else {
            return res.status(403).json({ message: "You are not authorized for this task!" });
        }
    } catch (error) {
        log.error("failed to delete the product from the cart")
        return res.status(500).json({ message: "Unknown error, please try again!", error: error.stack });
    }
};
