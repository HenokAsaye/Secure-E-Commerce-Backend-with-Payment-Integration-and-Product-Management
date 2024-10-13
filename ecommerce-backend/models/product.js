import mongoose , {Schema} from "mongoose";


const productSchema = mongoose.Schema({
    Name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    comment:{
        type:String
    },
    stock:{
        type:Number,
        required:true
    },
    ratings:[{
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        rate:{
            type:Number,
            min:1,
            max:5
        }
    }],
    createdAt:{
        type:Date,
        dafault:Date.now()
    },
    updatedAt:{
        type:Date,
        dafault:Date.now()
    }
})

const Product = mongoose.model('Product',productSchema);
export default Product;