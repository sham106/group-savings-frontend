import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserGroups } from '../../services/GroupService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Your Groups</h2>
        <Link
          to="/dashboard/create-group"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Create New Group
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No groups yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new group or joining an existing one.
          </p>
          <div className="mt-6">
            <Link
              to="/dashboard/create-group"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Create Group
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <li
              key={group.id}
              className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:shadow-lg transition-shadow"
            >
              <Link to={`/dashboard/group/${group.id}`} className="block">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {group.name}
                    </h3>
                    {group.member_status === 'admin' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {group.description || 'No description'}
                  </p>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(
                            (group.current_amount / group.target_amount) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm text-gray-500">
                      <span>
                        {group.current_amount} / {group.target_amount}
                      </span>
                      <span>
                        {Math.round(
                          (group.current_amount / group.target_amount) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupList;