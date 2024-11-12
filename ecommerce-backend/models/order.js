import mongoose , {Schema} from "mongoose";
const orderSchema = mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    orderitems:[{
        product:{
            type:Schema.Types.ObjectId,
            ref:'Product',
            required:true
        },
        quantity:{
            type:Number,
            min:1
        },
        price:{
            type:Number,
            required:true
        }
    }],

    orderStatus:{
        type:String,
        enum:["processing",'failed','delivered'],
        default:'processing'
    },
    paymentMethod:{
        type:String,
        enum:['stripe','paypal'],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:['pending','paid','failed'],
        default:'pending'
    },
    totalAmount:{
        type:Number,
        min:1
    },
    shippingAddress:{
        type:Schema.Types.ObjectId,
        ref:'Payment',
        req:true
    },
    orderStatus:{
        type:String,
        enum:['processing','shipping','cancelled','delivered'],
        default:'processing'
    },
    createdAt:{
        type:Date,
        dafualt:Date.now()
    },
    updatedAt:{
        type:Date,
        dafualt:Date.now()
    }
})

const Order = mongoose.model('Order',orderSchema);
export default Order;