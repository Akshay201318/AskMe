const express = require('express');

const router = express.Router();

router.use('/users', require('./users'));
router.use('/post', require('./createPost'));

module.exports = router;
