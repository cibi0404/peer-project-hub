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
    type: [String], // e.g. ["React", "MongoDB"]
    default: [],
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
    type: String, // Firebase UID of the project owner
    required: true,
  },
  userName: {
    type: String, // display name, so we don't need to join with users
    required: true,
  },
}, { timestamps: true }); // adds createdAt, updatedAt automatically

module.exports = mongoose.model('Project', projectSchema);