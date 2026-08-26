import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUploadCloud, FiSearch, FiMessageCircle } from 'react-icons/fi';
import api from '../utils/api';

function Home() {
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get('/projects');
        setRecentProjects(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Peer Project Hub
        </h1>
        <p className="text-lg text-blue-100 max-w-xl mx-auto mb-8">
          Share your coding projects, discover what others are building,
          and grow together as developers.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/projects"
            className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-md hover:bg-blue-50 transition"
          >
            Browse Projects
          </Link>
          <Link
            to="/create"
            className="bg-blue-500 bg-opacity-30 border border-white font-semibold px-6 py-3 rounded-md hover:bg-opacity-40 transition"
          >
            Post Your Project
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-16 px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div>
          <div className="flex justify-center mb-3">
            <FiUploadCloud className="text-blue-900" size={32} />
          </div>
          <h3 className="font-semibold text-lg mb-1">Post Your Work</h3>
          <p className="text-gray-500 text-sm">
            Share your coding projects with title, description, tags, and links.
          </p>
        </div>
        <div>
          <div className="flex justify-center mb-3">
            <FiSearch className="text-blue-900" size={32} />
          </div>
          <h3 className="font-semibold text-lg mb-1">Discover Projects</h3>
          <p className="text-gray-500 text-sm">
            Browse and search projects built by peers across categories.
          </p>
        </div>
        <div>
          <div className="flex justify-center mb-3">
            <FiMessageCircle className="text-blue-900" size={32} />
          </div>
          <h3 className="font-semibold text-lg mb-1">Give Feedback</h3>
          <p className="text-gray-500 text-sm">
            Comment, learn, and grow together as a developer community.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Projects</h2>
          <Link to="/projects" className="text-blue-700 text-sm hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : recentProjects.length === 0 ? (
          <p className="text-gray-500">No projects posted yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((project) => (
              <Link
                to={`/project/${project._id}`}
                key={project._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition block"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <span className="bg-blue-50 text-blue-900 text-xs px-2 py-1 rounded-md shrink-0 ml-2">
                    {project.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags && project.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;