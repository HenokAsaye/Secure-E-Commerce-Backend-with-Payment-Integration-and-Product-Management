import mongoose,{Schema} from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:strung,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    address:{
        country:String,
        region:String,
        city:String,
        subcity:String,
        streetnumber:Number,
        postalcode:Number
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    cart:[{
        productId:{
            type:Schema.Types.ObjectId,
            ref:'Product'
        },
        quantity:{
            type:Number,
            default:1
        }
    }],
    order:{
        type:Schema.Types.ObjectId,
        ref:'Order'
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    },
    createdAt:{
        type:Date,
        dafault:Date.now()
    },
    updatedAt:{
        type:Date,
        dafault:Date.now()
    }

})

const User = mongoose.model('User',userSchema);
export default User;