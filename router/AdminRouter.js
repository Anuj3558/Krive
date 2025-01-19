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
} from "../controllers/AdminController.js";
import upload from "../multerConfig.js";

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

export default AdminRouter;