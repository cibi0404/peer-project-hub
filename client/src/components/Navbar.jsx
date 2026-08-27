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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
        <Link to="/" className="text-lg sm:text-xl font-bold text-blue-900 shrink-0">
          Peer Project Hub
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/projects"
            className="text-sm text-gray-600 hover:text-blue-900 transition hidden md:block"
          >
            Projects
          </Link>

          {currentUser ? (
            <>
              <Link
                to="/create"
                className="text-xs sm:text-sm bg-blue-900 hover:bg-blue-800 text-white px-2.5 sm:px-3 py-1.5 rounded-md transition whitespace-nowrap"
              >
                + Post
              </Link>
              <span className="text-sm text-gray-600 hidden sm:block max-w-35 truncate">
                {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 sm:px-3 py-1.5 rounded-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-xs sm:text-sm bg-blue-900 hover:bg-blue-800 text-white px-3 sm:px-4 py-1.5 rounded-md transition whitespace-nowrap"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;