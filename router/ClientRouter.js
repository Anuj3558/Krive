import { Router } from "express";
import { createAlterationRequest, getAllAlterationRequests, getAllProductsForClient, placeOrder } from "../controllers/ClientController.js";
import upload from "../multerConfig.js";



const ClientRouter = Router();

ClientRouter.get("/products",getAllProductsForClient)
ClientRouter.post("/placeorder",placeOrder)
ClientRouter.post("/alteration",upload.single("image"),createAlterationRequest);
ClientRouter.get("/alteration",getAllAlterationRequests)



export default ClientRouter;