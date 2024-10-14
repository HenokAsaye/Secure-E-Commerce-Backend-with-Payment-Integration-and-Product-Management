import Product from "../models/product.js";
import User from "../models/user.js";


export const addToCart = async(req,res)=>{
    const {productId,quantity} = req.body

    try{
        const findProduct =  await Product.findById(productId);
        if(!findProduct){
            return res.status(404).json({message:"product not found!"});
        }
        if(User.cart.includes(productId)){
            User.cart.quantity +=quantity;
            await User.save();
            return res.status(200).json({message:"Product exists in you cart  the quantity is updated successfully!"})
        }

        User.cart.push({product:productId,quantity:quantity})
        await User.save();
        return res.status(200).json({message:"successfully added to the cart"})
    }catch(error){
        return res.status(500).json({message:"unkown error,Please Try Again!",error:error.stack})
    }
};