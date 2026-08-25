const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByProject,
  deleteComment,
} = require('../controllers/commentController');

// GET all comments for a project
router.get('/:projectId', getCommentsByProject);

// CREATE a new comment
router.post('/', createComment);

// DELETE a comment
router.delete('/:id', deleteComment);

module.exports = router;