import mongoose from 'mongoose';

const FabricCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FabricSubcategory',
  }],
});

const FabricCategory = mongoose.model('FabricCategory', FabricCategorySchema);

export default FabricCategory;