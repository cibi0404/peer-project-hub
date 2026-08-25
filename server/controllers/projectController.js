const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { title, description, tags, githubLink, liveDemoLink, userId, userName } = req.body;

    if (!title || !description || !githubLink || !userId || !userName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProject = new Project({
      title,
      description,
      tags,
      githubLink,
      liveDemoLink,
      userId,
      userName,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId !== req.user.uid) {
      return res.status(403).json({ message: 'You are not authorized to edit this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId !== req.user.uid) {
      return res.status(403).json({ message: 'You are not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};
