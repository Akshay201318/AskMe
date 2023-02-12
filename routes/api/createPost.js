const express = require('express');

const router = express.Router();

const createPostApi = require('../../controllers/api/createPostApi');

router.post('/create-post', createPostApi.create);
router.get('/posts', createPostApi.posts);
router.post('/post', createPostApi.post);

module.exports = router;
