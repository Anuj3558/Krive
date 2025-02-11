import mongoose from 'mongoose';

const FabricSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FabricSubcategory',
    required: true,
  },
  types: [{
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
});

const Fabric = mongoose.model('Fabric', FabricSchema);

export default Fabric;