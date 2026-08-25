const Comment = require('../models/Comment');

// CREATE a comment on a project
exports.createComment = async (req, res) => {
  try {
    const { projectId, userId, userName, text } = req.body;

    if (!projectId || !userId || !userName || !text) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newComment = new Comment({ projectId, userId, userName, text });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

// GET all comments for a specific project
exports.getCommentsByProject = async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

// DELETE a comment (only owner, enforced later via middleware)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};