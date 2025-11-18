import mongoose, { Schema } from "mongoose";
import mongoose, { Schema } from "mongoose";

const productSchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        default: [],
      },
    ],
    comment: {
      type: String,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    ratings: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        rate: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
