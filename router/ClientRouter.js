import { Router } from "express";
import { getAllProductsForClient } from "../controllers/ClientController.js";



const ClientRouter = Router();

ClientRouter.get("/products",getAllProductsForClient)

export default ClientRouter;