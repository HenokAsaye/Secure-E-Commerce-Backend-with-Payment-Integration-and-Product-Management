import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin','seller','customer','guest'],
        default: 'user'
    },
    address: {
        country: String,
        region: String,
        city: String,
        subcity: String,
        streetnumber: Number,
        postalcode: Number
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    cart: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpiresAt: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    isverified: {
        type: Boolean,
        default: false
    },
    lastlogin: {
        type: Date
    },
    resetPasswordExpiresAt: {
        type: Date
    },
    googleId: {
        type: String,
        unique: true
    }
}, { timestamps: true }); 

const User = mongoose.model('User', userSchema);
export default User;
