import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./connection.js";
import AdminRouter from "./router/AdminRouter.js";
import ClientRouter from "./router/ClientRouter.js";
import Admin from "./model/AdminSchema.js";
import bcrypt from "bcrypt"
import path from "path";
dotenv.config();
const corsOptions = {
  origin: "https://krivein.vercel.app", // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers)
};

const app = express();
const PORT = process.env.PORT || 5000;
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(
  cors({
    origin: ["https://krivein.vercel.app"], // allow your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // if you're sending cookies or auth headers
  })
);
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

const seedAdmin = async () => {
  await connectDB();

  const adminEmail = "krivecustom@gmail.com";

  try {
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists. Skipping seeding.");
      return; // Exit the function if the admin exists
    }

    // Create a new admin
    const admin = new Admin({
      email: adminEmail,
      password: await bcrypt.hash("krivecustom1234", 10),
    });

    // Save the admin to the database
    await admin.save();
    console.log("Admin seeded successfully.");
  } catch (err) {
    console.error("Error seeding admin:", err);
  }
};

// Run the seed function
seedAdmin();
app.use("/admin",AdminRouter);
app.use("/client",ClientRouter);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
