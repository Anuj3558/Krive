import mongoose from 'mongoose';

const alterationSchema = new mongoose.Schema({
  image: {
    type: String, // Path to the uploaded image file
    required: true,
  },
  instruction: {
    type: String,
    required: true,
  },
  userDetails: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
 
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Alteration = mongoose.model('Alteration', alterationSchema);

export default Alteration;