import { Router } from "express";
import {
  getAllCategories,
  getAllCustomizations,
  getAllSubcategories,
  HandleAddCategory,
  HandleAddCustomization,
  HandleAddSubcategory,
  HandleAddProduct,
  HandleDeleteProduct,
  getAllProducts,
  GetAllOrders,
  updateOrderStatus,
} from "../controllers/AdminController.js";
import upload from "../multerConfig.js";
import Admin from "../model/AdminSchema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getAllAlterationRequests } from "../controllers/ClientController.js";
const AdminRouter = Router();

// Route to add a category
AdminRouter.post("/addCategory", HandleAddCategory);
AdminRouter.get("/categories", getAllCategories);

// Route to add a subcategory
AdminRouter.post("/addSubcategory", HandleAddSubcategory);
AdminRouter.get("/subcategories", getAllSubcategories);

// Route to add a customization
AdminRouter.post("/addcustomization", upload.any(), HandleAddCustomization);
AdminRouter.get("/customizations", getAllCustomizations);

// Route to add a product
AdminRouter.post("/addProduct",upload.single("image"), HandleAddProduct);

// Route to delete a product
AdminRouter.delete("/deleteProduct/:id", HandleDeleteProduct);

// Route to get all products
AdminRouter.get("/products", getAllProducts);
AdminRouter.get("/orders", GetAllOrders);
AdminRouter.put("/updateorder/:orderId", updateOrderStatus);
const SECRET_KEY = "krivecustom";

// Middleware to check secret key


// Admin login
AdminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: admin._id, email: admin.email }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful.", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Failed to log in." });
  }
});

// Protected route example
AdminRouter.get("/getallaltrequest", getAllAlterationRequests);



export default AdminRouter;