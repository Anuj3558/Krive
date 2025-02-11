import mongoose from 'mongoose';

const MyDesignOrderSchema = new mongoose.Schema({
  // Customer Details
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },

  // Design Details
  designImage: {
    type: String, // URL or file path to the uploaded image
    required: true,
  },
  fabricTypeId: {
    type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
    ref: 'Fabric.types', // Reference to the fabric type
    required: true,
  },

  // Order Metadata
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the `updatedAt` field before saving
MyDesignOrderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const MyDesignOrder = mongoose.model('MyDesignOrder', MyDesignOrderSchema);

export default MyDesignOrder;