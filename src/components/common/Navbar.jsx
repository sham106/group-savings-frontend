// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <div className="flex-shrink-0 flex items-center">
//               <Link to="/" className="text-xl font-bold text-blue-600">
//                 SavingsGroups
//               </Link>
//             </div>
//             {user && (
//               <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//                 <Link
//                   to="/dashboard"
//                   className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
//                 >
//                   Dashboard
//                 </Link>
//               </div>
//             )}
//           </div>
//           <div className="hidden sm:ml-6 sm:flex sm:items-center">
//             {user ? (
//               <div className="flex items-center space-x-4">
//                 <span className="text-gray-700 text-sm font-medium">
//                   Hi, {user.username}
//                 </span>
//                 <button
//                   onClick={handleLogout}
//                   className="px-3 py-1 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="flex space-x-4">
//                 <Link
//                   to="/login"
//                   className="px-3 py-1 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="px-3 py-1 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}
//           </div>
//           {/* Mobile menu button */}
//           <div className="-mr-2 flex items-center sm:hidden">
//             <button
//               type="button"
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
//               aria-controls="mobile-menu"
//               aria-expanded="false"
//             >
//               <span className="sr-only">Open main menu</span>
//               {/* Menu icon */}
//               <svg
//                 className="block h-6 w-6"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       <div className="sm:hidden" id="mobile-menu">
//         <div className="pt-2 pb-3 space-y-1">
//           {user ? (
//             <>
//               <Link
//                 to="/dashboard"
//                 className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
//               >
//                 Dashboard
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 className="text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
//               >
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// frontend/group-saving/src/components/common/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Notifications from './Notifications';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
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
              <span className="font-bold text-xl">Group Savings</span>
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