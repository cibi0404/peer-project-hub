import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-blue-900">
            Peer Project Hub
          </Link>
          <Link
            to="/projects"
            className="text-sm text-gray-600 hover:text-blue-900 transition hidden sm:block"
          >
            Projects
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <Link
                to="/create"
                className="text-sm bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-md transition"
              >
                + Post Project
              </Link>
              <span className="text-sm text-gray-600">
                {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-sm bg-blue-900 hover:bg-blue-800 text-white px-4 py-1.5 rounded-md transition"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;