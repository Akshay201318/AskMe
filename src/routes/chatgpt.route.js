const express = require('express');

const chatgptController = require('../controllers/chatgpt.controller');


const router = express.Router();

router.get('/getResponse',chatgptController.getResponse);

module.exports = router;