import mongoose ,{Schema} from "mongoose";


const paymentSchema = mongoose.Schema({
    order:{
        type:Schema.Types.ObjectId,
        ref:'Order'
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    paymentMethod:{
        type:String,
        enum:['stripe','paypal']
    },
    Amount:{
        type:Number,
        required:true
    },
    shippingAddress:{
        country:String,
        region:String,
        city:String,
        subcity:String,
        streetnumber:Number,
        postalcode:Number
    },
    status:{
        type:String,
        enum:['pending','failed','completed'],
        default:'pending'
    },
    paymentDate:{
        type:Date,
        default:Date.now()
    },
    transactionId:{
        type:String,
        required:true
    }
});

const Payment = mongoose.model('Payment',paymentSchema);
export default Payment;