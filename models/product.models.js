const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const productSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  user : {
    type : String
  }
});

  
  const Product = mongoose.model('Product', productSchema);
  
  module.exports = {Product};