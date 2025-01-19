import Category from "../model/categorySchema.js"; // Import the Category model
import Subcategory from "../model/subcategorySchema.js";
import Customization from "../model/customizationSchema.js";
import Product from "../model/productSchema.js";
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
export const HandleDeleteProduct = async (req, res) => {
  const productId  = req?.params.id;
  console.log(req.params.id)
  
console.log(productId)
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
  const image = req.file ? req.file.path : null;
   

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
