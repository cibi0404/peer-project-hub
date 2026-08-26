import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = ['All', 'Web App', 'Mobile App', 'AI/ML', 'Game', 'Tool/Utility', 'Other'];

function Feed() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (err) {
        setError('Failed to load projects. Is the backend running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      term === '' ||
      project.title.toLowerCase().includes(term) ||
      project.userName.toLowerCase().includes(term) ||
      (project.tags && project.tags.some((tag) => tag.toLowerCase().includes(term)));

    return matchesCategory && matchesSearch;
  });

  if (loading) return <p className="text-center mt-10">Loading projects...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
        Peer Project Hub
      </h1>

      <div className="max-w-6xl mx-auto mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search by title, tag, or user"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="text-center text-gray-500">
          {projects.length === 0
            ? 'No projects yet. Be the first to post!'
            : 'No projects match your search.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col"
            >
              <Link to={`/project/${project._id}`} className="block grow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <span className="bg-blue-50 text-blue-900 text-xs px-2 py-1 rounded-md shrink-0 ml-2">
                    {project.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags && project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mb-2">by {project.userName}</p>
              </Link>
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 text-sm hover:underline inline-block mt-1"
                >
                  View on GitHub
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;