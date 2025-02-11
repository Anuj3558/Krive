import { Router } from "express";
import { createAlterationRequest, createMyDesignOrder, getAllAlterationRequests, getAllFabricCategories, getAllFabricSubcategories, getAllProductsForClient, getFabricData, placeOrder } from "../controllers/ClientController.js";
import upload from "../multerConfig.js";



const ClientRouter = Router();

ClientRouter.get("/products",getAllProductsForClient)
ClientRouter.post("/placeorder",placeOrder)
ClientRouter.post("/alteration",upload.single("image"),createAlterationRequest);
ClientRouter.post("/submit-mydesign-order",upload.single("designImage"),createMyDesignOrder  );
ClientRouter.get("/alteration",getAllAlterationRequests)
ClientRouter.get("/fabric-categories",getAllFabricCategories)
ClientRouter.get("/fabric-subcategories",getAllFabricSubcategories)
ClientRouter.get("/getallfabrics",getFabricData)



export default ClientRouter;