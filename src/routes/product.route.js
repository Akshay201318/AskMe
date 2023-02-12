const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const productController = require('../controllers/product.controller');

const router = express.Router();

router.post('/create', auth(),productController.createProduct);
router.post('/getAllProducts', auth(), productController.getProducts);
router.patch('/updateProduct', auth(), productController.updateProduct);
router.post('/getProduct', auth(), productController.getProduct);
router.delete('/deleteProduct', auth(), productController.deleteProduct);
router.post('/downloadProduct', auth(), productController.downloadProduct);
router.get('/printProduct', productController.printProduct);

module.exports = router;