const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Cardio', 'Strength', 'Yoga', 'Supplements', 'Accessories'], // Predefined list of categories
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Ensure `updatedAt` is updated on every save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
