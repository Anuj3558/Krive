import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./connection.js";
import AdminRouter from "./router/AdminRouter.js";
import ClientRouter from "./router/ClientRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());

connectDB();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "secretkey") {
    next(); // Allow access
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

app.use("/admin",AdminRouter);
app.use("/client",ClientRouter);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});