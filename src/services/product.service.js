const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const downloadPDF = require('../utils/pdf');

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return product;
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.remove();
  return product;
};


/**
 * Download product
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
 const downloadProduct = async (data) => {
  const product = await getProductById(data._id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  console.log("product>>>>>>>>>>>>>", JSON.stringify(product))
  return product;
};

const printProduct = async (data) =>{
  const ejs = require("ejs");
  const html = ejs.render(`<h1>Hello<h1>`);
  // console.log("html >>>>>>>>>>>>>>>>>", html);
  const htmlObj = {
    html: html,
  };

    return downloadPDF(htmlObj);
}



module.exports = {
  createProduct,
  queryProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  downloadProduct,
  printProduct
};
