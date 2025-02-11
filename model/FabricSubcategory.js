import mongoose from 'mongoose';

const FabricSubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FabricCategory',
    required: true,
  },
  fabrics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fabric',
  }],
});

const FabricSubcategory = mongoose.model('FabricSubcategory', FabricSubcategorySchema);

export default FabricSubcategory;