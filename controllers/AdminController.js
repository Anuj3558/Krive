import Category from "../model/categorySchema.js"; // Import the Category model
import Subcategory from "../model/subcategorySchema.js";
import Customization from "../model/customizationSchema.js";
import Product from "../model/productSchema.js";
import Order from "../model/orderSchema.js";
import FabricSubcategory from "../model/FabricSubcategory.js";
import FabricCategory from "../model/FabricCategory.js";
import Fabric from "../model/Fabric.js";
import mongoose from "mongoose";



export const addFabricSubcategory = async (req, res) => {
  const { name, category } = req.body;

  // Validate input
  if (!name || !category) {
    return res.status(400).json({ error: "Name and category are required." });
  }

  try {
    // Check if the category exists
    const existingCategory = await FabricCategory.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ error: "Category does not exist." });
    }

    // Check if the subcategory already exists
    const existingSubcategory = await FabricSubcategory.findOne({ name, category });
    if (existingSubcategory) {
      return res.status(400).json({ error: "Subcategory already exists for this category." });
    }

    // Create a new subcategory
    const newSubcategory = new FabricSubcategory({ name, category });

    // Save the subcategory to the database
    await newSubcategory.save();

    // Add the subcategory to the category's subcategories array
    existingCategory.subcategories.push(newSubcategory._id);
    await existingCategory.save();

    // Send success response
    res.status(201).json({ message: "Fabric subcategory added successfully.", subcategory: newSubcategory });
  } catch (err) {
    console.error("Error adding fabric subcategory:", err);
    res.status(500).json({ error: "Failed to add fabric subcategory." });
  }
};

export const addFabric = async (req, res) => {
  const { name, subcategory } = req.body;
  console.log(req.files)
  // Extract types from the request
  const types = [];
  let i = 0;
  while (true) {
    const typeName = req.body.types?.[i]?.name;
    const typeImage = req.files?.[`${i}`]?.path; // Access the file path

    // Stop the loop if no more types are found
    if (!typeName || !typeImage) {
      break;
    }

    types.push({
      id: new mongoose.Types.ObjectId().toString(), // Generate a unique ID for the type
      name: typeName,
      image: typeImage, // Use the file path
      price: req.body.types[i].price || 0, // Default price to 0 if not provided
    });

    i++; // Move to the next type
  }
console.log(types)
  // Validate input
  if (!name || !subcategory || types.length === 0) {
    return res.status(400).json({ error: "Name, subcategory, and types are required." });
  }

  try {
    // Check if the subcategory exists
    const existingSubcategory = await FabricSubcategory.findById(subcategory);
    if (!existingSubcategory) {
      return res.status(400).json({ error: "Subcategory does not exist." });
    }

    // Create a new fabric
    const newFabric = new Fabric({
      name,
      subcategory,
      types,
    });

    // Save the fabric to the database
    await newFabric.save();

    // Add the fabric to the subcategory's fabrics array
    existingSubcategory.fabrics.push(newFabric._id);
    await existingSubcategory.save();

    // Send success response
    res.status(201).json({ message: "Fabric added successfully.", fabric: newFabric });
  } catch (err) {
    console.error("Error adding fabric:", err);
    res.status(500).json({ error: "Failed to add fabric." });
  }
};
export const HandleFabricSubcategory = async (req, res) => {
  const { name, categoryId } = req.body;

  try {
    // Check if the category exists
    const category = await FabricCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Create a new subcategory
    const newSubcategory = new FabricSubcategory({ name, category: categoryId });
    await newSubcategory.save();

    // Add the subcategory to the category
    category.subcategories.push(newSubcategory._id);
    await category.save();

    res.status(201).json({ message: 'Subcategory created successfully', subcategory: newSubcategory });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const HandleFabricCategory = async (req, res) => {
  const { name } = req.body;

  try {
    // Check if the category already exists
    const existingCategory = await FabricCategory.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create a new category
    const newCategory = new FabricCategory({ name });
    await newCategory.save();

    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const HandleAddCategory = async (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ error: "Category name is required." });
  }

  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists." });
    }

    // Create a new category
    const newCategory = new Category({ name });
    await newCategory.save();

    // Send success response
    res.status(201).json({ message: "Category added successfully.", category: newCategory });
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ error: "Failed to add category." });
  }
};
export const getAllSubcategories = async (req, res) => {
  try {
    // Fetch all subcategories and populate the 'category' field
    const subcategories = await Subcategory.find({}).populate("category", "name");

    // Send the subcategories to the frontend
    res.status(200).json(subcategories);
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    res.status(500).json({ error: "Failed to fetch subcategories." });
  }
};

export const HandleAddSubcategory = async (req, res) => {
  const { categoryName, name } = req.body;

  // Validate input
  if (!categoryName || !name) {
    return res.status(400).json({ error: "Category name and subcategory name are required." });
  }

  try {
    // Fetch the category by its name
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    // Check if the subcategory already exists for this category
    const existingSubcategory = await Subcategory.findOne({ name, category: category._id });
    if (existingSubcategory) {
      return res.status(400).json({ error: "Subcategory already exists for this category." });
    }

    // Create a new subcategory
    const newSubcategory = new Subcategory({ name, category: category._id });
    await newSubcategory.save();

    // Add the subcategory to the category's subcategories array
    
  

    // Send success response
    res.status(201).json({ message: "Subcategory added successfully.", subcategory: newSubcategory });
  } catch (err) {
    console.error("Error adding subcategory:", err);
    res.status(500).json({ error: "Failed to add subcategory." });
  }
};
// Function to get all categories
export const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find({});

    // Send the categories to the frontend
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories." });
  }
};
export const HandleAddCustomization = async (req, res) => {
  const { name } = req.body;
  
  // Extract options from the request
  const options = [];
  var i=0;
  while (true) {
    const optionName = req?.body?.options[`${i}`]?.name
    const optionImage = req?.files[`${i}`]?.path; // Access the file directly
    // Stop the loop if no more options are found
    if (!optionName || !optionImage) {
      break;
    }
    

    options.push({
      name: optionName,
      image: optionImage, // Use the file path
    });

    i++; // Move to the next option
  }

  // Validate input
  if (!name || options.length === 0) {
    return res.status(400).json({ error: "Name and options are required." });
  }

  try {
    // Check if the customization already exists
    const existingCustomization = await Customization.findOne({ name });
    if (existingCustomization) {
      return res.status(400).json({ error: "Customization already exists." });
    }

    // Create a new customization
    const newCustomization = new Customization({ name, options });
    await newCustomization.save();

    // Send success response
    res.status(201).json({ message: "Customization added successfully.", customization: newCustomization });
  } catch (err) {
    console.error("Error adding customization:", err);
    res.status(500).json({ error: "Failed to add customization." });
  }
};
// Get All Customizations
export const getAllCustomizations = async (req, res) => {
  try {
    // Fetch all customizations from the database
    const customizations = await Customization.find({});

    // Send the customizations to the frontend
    res.status(200).json(customizations);
  } catch (err) {
    console.error("Error fetching customizations:", err);
    res.status(500).json({ error: "Failed to fetch customizations." });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params; // Extract orderId from the URL
  const { status } = req.body; // Extract new status from the request body

  // Validate input
  if (!orderId || !status) {
    return res.status(400).json({ error: "Order ID and status are required." });
  }

  // Validate status
  const validStatuses = ["Pending", "Processing", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Update the order status
    order.status = status;
    await order.save();

    // Send success response
    res.status(200).json({ message: "Order status updated successfully.", order });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status." });
  }
};
export const GetAllOrders = async (req, res) => {
  try {
    // Fetch all orders and populate the 'product' field
    const orders = await Order.find({})
      .populate({
        path: "product",
        select: "name image category subcategory", // Select specific fields from the product
        populate: [
          {
            path: "category",
            select: "name", // Populate the category name
          },
          {
            path: "subcategory",
            select: "name", // Populate the subcategory name
          },
        ],
      })
      .sort({ createdAt: -1 }); // Sort by creation date (newest first)

    // Format the orders for better readability
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      product: {
        name: order.product?.name || "N/A",
        image: order.product?.image || "N/A",
        category: order.product?.category?.name || "N/A",
        subcategory: order.product?.subcategory?.name || "N/A",
      },
      selectedOptions: Object.fromEntries(order.selectedOptions), // Convert Map to plain object
      userDetails: order.userDetails,
      location: order.location,
      status: order.status,
      createdAt: order.createdAt,
    }));

    // Send the formatted orders to the frontend
    res.status(200).json(formattedOrders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};
export const HandleDeleteProduct = async (req, res) => {
  const productId  = req?.params.id;
  
  // Validate input
  if (!productId) {
    return res.status(400).json({ error: "Product ID is required." });
  }

  try {
    // Check if the product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Delete the product
    await Product.findByIdAndDelete(productId);

    // Send success response
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product." });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products and populate the 'subcategory' and 'customizations' fields
    const products = await Product.find({})
      .populate("subcategory", "name")
      .populate("customizations", "name");

    // Send the products to the frontend
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products." });
  }
};
export const HandleAddProduct = async (req, res) => {
  const { name,  categoryId, subcategoryId, customizations } = req.body;
  const image = req.file ? req.file.location : null;
  console.log(req.file)

  if (!name || !subcategoryId) {
    return res.status(400).json({ error: 'Name and subcategory are required.' });
  }

  try {
    const existingSubcategory = await Subcategory.findById(subcategoryId);
    if (!existingSubcategory) {
      return res.status(404).json({ error: 'Subcategory not found.' });
    }
    const existingcategory = await Category.findById(categoryId);
    if (!existingcategory) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    let customizationsArray = [];
    if (customizations) {
      try {
        // Parse the string into an array
        customizationsArray = JSON.parse(customizations);
         
        // Validate each item in the array as a valid ObjectId
      
      } catch (error) {
        return res.status(400).json({ error: "Invalid customizations format." });
      }
    }

    const newProduct = new Product({
      name,
      category:categoryId,
      image,
      subcategory:subcategoryId,
      customizations: customizationsArray ,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully.', product: newProduct });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product.' });
  }
};

// Delete a product
