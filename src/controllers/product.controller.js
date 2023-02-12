const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const fs = require('fs');
const path = require('path');

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.body.id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product);
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.body, ['id']);
  const options = pick(req.body, ['sortBy', 'limit', 'page']);
  const product = await productService.queryProducts(filter, options);
  res.status(httpStatus.CREATED).send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const productBody = {
    ...req.body,
    file: req.file && req.file.filename,
  };
  const product = await productService.updateProductById(req.body.id, productBody);
  res.send(product);
}); 

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.body.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const downloadProduct = catchAsync(async (req, res) => {
  const excelFile = await productService.downloadProduct(req.body);
  res.send(excelFile);
});

const printProduct = catchAsync(async (req, res) => {
  const pdfFile = await productService.printProduct(req.body);
  // await fs.writeFileSync(pdfFile._fileName, pdfFile._data);
  // res.sendFile(path.resolve(`./${pdfFile._fileName}`));
});

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  getProduct,
  deleteProduct,
  downloadProduct,
  printProduct
};
