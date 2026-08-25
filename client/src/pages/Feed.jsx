import { useEffect, useState } from 'react';
import api from '../utils/api';

function Feed() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p className="text-center mt-10">Loading projects...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Peer Project Hub
      </h1>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No projects yet. Be the first to post!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
                            <p className="text-xs text-gray-400 mb-2">by {project.userName}</p>
              
<a
  href={project.githubLink}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-500 text-sm hover:underline"
>
  View on GitHub
</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;
