

import Product from "../model/productSchema.js";
import Order from '../model/orderSchema.js'; // Import the Order model

// Controller function to save order details
import nodemailer from 'nodemailer';
import Customization from "../model/customizationSchema.js";
import Alteration from "../model/alterationSchema.js";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "anujloharkar3557@gmail.com",
    pass: "uftqmoltbsdrmgop"
  }
});

const generateOrderEmailTemplate = (order, product, userDetails) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f7f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .content {
      padding: 30px;
    }
    .order-details {
      background-color: #f8fafc;
      padding: 25px;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    .product-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .product-info:last-child {
      border-bottom: none;
    }
    .price {
      font-size: 24px;
      color: #2d3748;
      font-weight: bold;
    }
    .shipping-info {
      background-color: #fff;
      padding: 20px;
      margin: 15px 0;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
      color: white;
      text-decoration: none;
      border-radius: 25px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      margin-top: 20px;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .footer {
      text-align: center;
      padding: 30px;
      background-color: #f8fafc;
      color: #718096;
    }
    .order-id {
      font-family: 'Courier New', monospace;
      background-color: #edf2f7;
      padding: 5px 10px;
      border-radius: 4px;
      font-weight: bold;
    }
    .icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 10px;
      vertical-align: middle;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Order Confirmed!</h1>
    </div>
    <div class="content">
      <p>Dear ${userDetails?.name || 'Valued Customer'},</p>
      <p>Thank you for shopping with us! We're thrilled to confirm your order has been successfully placed.</p>
      
      <div class="order-details">
        <h2>Order Summary</h2>
        <p><strong>Order ID:</strong> <span class="order-id">${order?._id || 'N/A'}</span></p>
        
        <div class="product-info">
          <div>
            <h3>${product?.name || 'Product Name'}</h3>
          </div>
        </div>

        <div class="shipping-info">
          <h3>
            <span class="icon">📱</span>Contact Information
          </h3>
          <p>${userDetails?.phone || 'Phone not provided'}</p>
          <h3>
            <span class="icon">📍</span>Shipping Address
          </h3>
          <p>${userDetails?.location || 'Address not provided'}</p>
        </div>
      </div>

      <p>Questions about your order? Our customer service team is here to help!</p>
      <a href="mailto:support@yourcompany.com" class="button">Contact Support</a>
    </div>

    <div class="footer">
      <p>Email sent to: ${userDetails?.email || 'N/A'}</p>
      <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const placeOrder = async (req, res) => {
  const { productId, selectedOptions, userDetails, location } = req.body;

  try {
    // Validate required fields
    if (!productId?.trim() || !userDetails?.email || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create order object with proper data mapping
    const newOrder = new Order({
      product: productId,
      selectedOptions: new Map(Object.entries(selectedOptions || {})),
      userDetails: {
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        location: userDetails.location
      },
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      status: 'Pending',
      createdAt: new Date()
    });

    await newOrder.save();

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userDetails.email,
      subject: '🎉 Order Confirmation - Your Purchase is Confirmed!',
      html: generateOrderEmailTemplate(newOrder, product, userDetails)
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Order placed successfully', 
      order: newOrder 
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ 
      message: 'Failed to place order. Please try again.' 
    });
  }
};
// Email template for alteration request confirmation
const generateAlterationEmailTemplate = (alteration) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alteration Request Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f7f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .content {
      padding: 30px;
    }
    .details {
      background-color: #f8fafc;
      padding: 25px;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    .footer {
      text-align: center;
      padding: 30px;
      background-color: #f8fafc;
      color: #718096;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Alteration Request Received!</h1>
    </div>
    <div class="content">
      <p>Dear ${alteration.userDetails.name},</p>
      <p>Thank you for submitting your alteration request. We have received the following details:</p>
      
      <div class="details">
        <h2>Request Details</h2>
        <p><strong>Instructions:</strong> ${alteration.instruction}</p>
        <p><strong>Status:</strong> ${alteration.status}</p>
        <p><strong>Address:</strong> ${alteration.userDetails.address}</p>
      </div>

      <p>We will process your request shortly. You will receive updates on your email.</p>
    </div>

    <div class="footer">
      <p>Email sent to: ${alteration.userDetails.email}</p>
      <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Controller function to handle alteration request
export const createAlterationRequest = async (req, res) => {
  const { instruction, userDetails } = req.body;
  const parsedUserDetails = JSON.parse(userDetails);
  console.log(parsedUserDetails)
  try {
    // Validate required fields
    if (  !instruction || !userDetails ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const filename = req?.file?.path;
    const Address = userDetails?.address;
    // Create new alteration request
    const newAlteration = new Alteration({
      image:filename,
      instruction,
      userDetails:parsedUserDetails,
      status: 'Pending', // Default status
    });

    // Save to database
    await newAlteration.save();

    // Send confirmation email
    const mailOptions = {
      from: "anujloharkar3557@gmail.com",
      to: parsedUserDetails?.email,
      subject: '🎉 Alteration Request Received!',
      html: generateAlterationEmailTemplate(newAlteration),
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'Alteration request submitted successfully',
      alteration: newAlteration,
    });
  } catch (error) {
    console.error('Error creating alteration request:', error);
    res.status(500).json({ message: 'Failed to submit alteration request' });
  }
};

// Controller function to get all alteration requests
export const getAllAlterationRequests = async (req, res) => {
  try {
    const alterations = await Alteration.find();
    res.status(200).json(alterations);
  } catch (error) {
    console.error('Error fetching alteration requests:', error);
    res.status(500).json({ message: 'Failed to fetch alteration requests' });
  }
};
export const getAllProductsForClient = async (req, res) => {
    try {
      // Fetch all products and populate the referenced fields
      const products = await Product.find({})
        .populate("category", "name") // Populate category with only the 'name' field
        .populate("subcategory", "name") // Populate subcategory with only the 'name' field
        .populate({
          path: "customizations",
          select: "name options", // Populate customizations with 'name' and 'options' fields
          populate: {
            path: "options", // Populate the 'options' array inside customizations
            select: "name image", // Include 'name' and 'image' fields for each option
          },
        });
        console.log(products);
  
      // Send the populated products to the frontend
      res.status(200).json(products);
    } catch (err) {
      console.error("Error fetching products for client:", err);
      res.status(500).json({ error: "Failed to fetch products for client." });
    }
  };