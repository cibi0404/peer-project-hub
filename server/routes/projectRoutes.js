const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

// GET all projects (feed)
router.get('/', getAllProjects);

// GET single project by ID
router.get('/:id', getProjectById);

// CREATE a new project
router.post('/', createProject);

// UPDATE a project
router.put('/:id', updateProject);

// DELETE a project
router.delete('/:id', deleteProject);

module.exports = router;