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
    shippingAddress:{
        country:String,
        region:String,
        city:String,
        subcity:String,
        streetnumber:Number,
        postalcode:Number
    },
    paymentMethod:{
        type:String,
        enum:['stripe','paypal'],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:['pending','payed','failed'],
        default:'pending'
    },
    totalAmount:{
        type:Number,
        min:1
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