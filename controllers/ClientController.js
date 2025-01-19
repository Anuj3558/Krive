

import Product from "../model/productSchema.js";

export const getAllProductsForClient = async (req, res) => {
    try {
      // Fetch all products and populate the referenced fields
      const products = await Product.find({})
        .populate("category", "name") // Populate category with only the 'name' field
        .populate("subcategory", "name") // Populate subcategory with only the 'name' field
        .populate({
          path: "customizations",
          select: "name options", // Populate customizations with 'name' and 'options' fields
          populate: {
            path: "options", // Populate the 'options' array inside customizations
            select: "name image", // Include 'name' and 'image' fields for each option
          },
        });
        console.log(products);
  
      // Send the populated products to the frontend
      res.status(200).json(products);
    } catch (err) {
      console.error("Error fetching products for client:", err);
      res.status(500).json({ error: "Failed to fetch products for client." });
    }
  };