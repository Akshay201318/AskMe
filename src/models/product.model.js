const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    product_id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    product_price: {
      type: Number,
      required: true
    },
    product_size: {
      type: String
    },
    product_status: {
      type: String
    },
    product_decription: {
      type: String
    },
    product_quantity: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
