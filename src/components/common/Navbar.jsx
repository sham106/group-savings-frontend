// frontend/group-saving/src/components/common/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Notifications from './Notifications';
import logo from '../../assets/logop.png'

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount = 0 } = useNotifications() || {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
            <img 
                src={logo} // Update the path to your logo file
                alt="Group Savings Logo" 
                className="h-24 w-auto" // Adjust height and width as needed
              />
            </Link>
            {user && (
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  Dashboard
                </Link>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  My Groups
                </Link>
                <Link to="/dashboard/discover" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  Discover Groups
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {user ? (
              <>
                {/* Notifications */}
                <div className="mr-4">
                  <Notifications />
                </div>
                
                {/* User menu */}
                <div className="ml-3 relative">
                  <div>
                    <button 
                      onClick={toggleMenu}
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    </button>
                  </div>
                  
                  {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="px-4 py-2 text-xs text-gray-500">
                        Signed in as <span className="font-medium text-gray-900">{user.username}</span>
                      </div>
                      <Link 
                        to="/dashboard/profile" 
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium bg-white text-indigo-600 hover:bg-gray-100">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;