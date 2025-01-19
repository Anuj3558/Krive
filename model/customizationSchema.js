import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store the 32-bit binary string
    required: true,
  },
});

const customizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  options: [optionSchema], // Array of options
});

const Customization = mongoose.model("Customization", customizationSchema);

export default Customization;