import Product from "../models/product.js";
import User from "../models/user.js";


export const addToCart = async(req,res)=>{
    const {productId,quantity} = req.body

    try{
         const user = await User.findById(req.user._id)

         if(!user){
            return res.staus(404).json({message:"user not found!"})
         }
        const findProduct =  await Product.findById(productId);
        if(!findProduct){
            return res.status(404).json({message:"product not found!"});
        }
        const existingProduct = await user.cart.find(item =>item.productId.toString()  == productId.toString());

        if(existingProduct){
            existingProduct.quantity += quantity;
            await user.save();
            return res.status(200).json({ message: "Product quantity updated successfully!" });
        }
      

        user.cart.push({product:productId,quantity:quantity})
        await user.save();
        return res.status(200).json({message:"successfully added to the cart"})
    }catch(error){
        return res.status(500).json({message:"unkown error,Please Try Again!",error:error.stack})
    }
};

export const updateCart = async(req,res)=>{
    const {productId,quantity} = req.body
    try{

        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message:"Prduct not find"})
        }
        const findProduct = await user.cart.find(Item => Item.productId.toString() === productId.toString());
        if(!findProduct){
            return res.status(404).json({message:"Prduct not find"})
        }
        if(quantity > 0 ){
            user.cart.quantity +=quantity
            await user.save();
            return res.status(200).json("you have updated suucessfully!")
        }
        else if((user.cart.quantity >= Math.abs(quantity)) &&  quantity < 0){
            user.cart.quantity -=quantity;
            await user.save()
            return res.status(200).json("you have updated suucessfully!")
        }
        else if((user.cart.quantity < Math.abs(quantity)) &&  quantity < 0){
            user.cart.quantity =0;
            return res.status(400).json({message:"you have less amount of quanity than you have depricate"});
            await user.save()
        }
        
    }catch(error){
        return res.status(500).json({message:"unkown error,Please Try Again!",error:error.stack})
    }
};

export const getUserCart = async(req,res)=>{
    const{userid} = req.params
    try{

    }catch(error){
        
    }
}
