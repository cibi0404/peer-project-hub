const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', getAllProjects);
router.get('/:id', getProjectById);

router.post('/', verifyToken, createProject);
router.put('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);

module.exports = router;
