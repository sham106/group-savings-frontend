import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserGroups, getPublicGroups } from '../services/GroupService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getUserGroups();
        setGroups(response.groups);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full text-left group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900 text-gray-600"
                >
                  <span className="truncate">My Groups</span>
                </button>
                {/* added discovery button */}
                <button
                  onClick={() => navigate('/dashboard/discover')}
                  className="w-full text-left group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900 text-gray-600"
                >
                  <span className="truncate">Discover Groups</span>
                  {getPublicGroups.length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate('/dashboard/create-group')}
                  className="w-full text-left group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900 text-gray-600"
                >
                  <span className="truncate">Create Group</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard/profile')}
                  className="w-full text-left group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900 text-gray-600"
                >
                  <span className="truncate">Profile</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900 text-gray-600"
                >
                  <span className="truncate">Logout</span>
                </button>
              </nav>
            </div>

            {/* Groups list */}
            <div className="mt-4 bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Your Groups
              </h3>
              {error && <ErrorMessage message={error} />}
              {groups.length === 0 ? (
                <p className="text-sm text-gray-500">
                  You haven't joined any groups yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {groups.map((group) => (
                    <li key={group.id}>
                      <button
                        onClick={() => navigate(`/dashboard/group/${group.id}`)}
                        className="w-full text-left group flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-50 hover:text-gray-900 text-gray-600"
                      >
                        <span className="truncate">{group.name}</span>
                        {group.member_status === 'admin' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Admin
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <Outlet context={{ groups }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;