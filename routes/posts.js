const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts')

router.get('/posts', postsController.getPosts);
router.post('/post', postsController.createPost);
router.delete('/posts', postsController.deletePosts);
router.delete('/post/:id', postsController.deletePost);
router.patch('/post/:id', postsController.patchPost);

module.exports = router;