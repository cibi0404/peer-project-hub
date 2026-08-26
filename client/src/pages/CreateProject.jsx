import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

function CreateProject() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('Web App');
  const [githubLink, setGithubLink] = useState('');
  const [liveDemoLink, setLiveDemoLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);

  const handleImproveDescription = async () => {
    if (!description.trim()) {
      setError('Write a rough description first, then improve it with AI.');
      return;
    }

    setImproving(true);
    setError('');
    try {
      const response = await api.post('/ai/improve-description', {
        title,
        description,
      });
      setDescription(response.data.improvedDescription);
    } catch (err) {
      setError('AI improvement failed. Please try again.');
      console.error(err);
    } finally {
      setImproving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('You must be logged in to post a project.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/projects', {
        title,
        description,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        category,
        githubLink,
        liveDemoLink,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
      });
      toast.success('Project posted!');
      navigate('/projects');
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">
          Please{' '}
          <Link to="/auth" className="text-blue-700 font-medium hover:underline">
            log in
          </Link>{' '}
          to post a project.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">
          Post a New Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
            required
          />

          <div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
              required
            />
            <button
              type="button"
              onClick={handleImproveDescription}
              disabled={improving}
              className="mt-2 text-xs bg-blue-50 text-blue-900 px-3 py-1.5 rounded-md hover:bg-blue-100 transition disabled:opacity-50"
            >
              {improving ? 'Improving...' : '✨ Improve with AI'}
            </button>
          </div>

          <input
            type="text"
            placeholder="Tags (comma separated, e.g. React, MongoDB)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
          >
            <option value="Web App">Web App</option>
            <option value="Mobile App">Mobile App</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Game">Game</option>
            <option value="Tool/Utility">Tool/Utility</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="url"
            placeholder="GitHub Repo Link"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
            required
          />

          <input
            type="url"
            placeholder="Live Demo Link (optional)"
            value={liveDemoLink}
            onChange={(e) => setLiveDemoLink(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white rounded-md py-2 text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Project'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;