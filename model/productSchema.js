import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Remove extra spaces
    },
    image: {
      type: String, // URL to the product image
      default: "", // Default to an empty string if no image is provided
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    customizations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customization",
      },
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Product = mongoose.model("Product", productSchema);

export default Product;