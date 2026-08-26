const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    enum: ['Web App', 'Mobile App', 'AI/ML', 'Game', 'Tool/Utility', 'Other'],
    default: 'Other',
  },
  githubLink: {
    type: String,
    required: true,
  },
  liveDemoLink: {
    type: String,
    default: '',
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
