import mongoose ,{Schema} from "mongoose";


const cartSchema = mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    items:[{
        product:{
            type:Schema.Types.ObjectId,
            ref:'Product'
        },
        quantity:{
            type:Number,
            required:true,
            min:1
        },
        price:{
            type:Number,
            required:true
        }
    }],
    totalPrice:{
        type:Number,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        dafault:Date.now()
    }
});

const Cart = mongoose.model('Order',orderSchema);
export default Cart;