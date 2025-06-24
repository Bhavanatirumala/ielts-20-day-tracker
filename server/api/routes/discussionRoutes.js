const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  listPosts,
  createPost,
  getPost,
  addComment,
  editPost,
  deletePost,
  toggleLikePost,
  toggleLikeComment,
  editComment,
  deleteComment,
  getTags
} = require('../controllers/discussionController');

router.get('/posts', listPosts);
router.post('/posts', auth, createPost);
router.get('/posts/:id', getPost);
router.patch('/posts/:id', auth, editPost);
router.delete('/posts/:id', auth, deletePost);
router.post('/posts/:id/comments', auth, addComment);
router.post('/posts/:id/like', auth, toggleLikePost);
router.post('/comments/:commentId/like', auth, toggleLikeComment);
router.patch('/comments/:commentId', auth, editComment);
router.delete('/comments/:commentId', auth, deleteComment);
router.get('/tags', getTags);

module.exports = router; 