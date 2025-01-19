import { Router } from "express";
import { getAllProductsForClient, placeOrder } from "../controllers/ClientController.js";



const ClientRouter = Router();

ClientRouter.get("/products",getAllProductsForClient)
ClientRouter.post("/placeorder",placeOrder)


export default ClientRouter;