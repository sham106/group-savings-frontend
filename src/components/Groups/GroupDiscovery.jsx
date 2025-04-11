import { useState, useEffect } from 'react';
import { getPublicGroups, joinGroup } from '../../services/GroupService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const GroupDiscovery = () => {
  const [publicGroups, setPublicGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchPublicGroups = async () => {
      try {
        // You'll need to implement getPublicGroups in your groupService
        const response = await getPublicGroups();
        setPublicGroups(response.groups);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicGroups();
  }, []);

  const handleJoinGroup = async (groupId) => {
    try {
        console.log('Joining group with payload:', { group_id: groupId });
      await joinGroup(groupId);
      setSuccess(`Successfully joined group!`);
      // Remove the joined group from the list
      setPublicGroups(publicGroups.filter(group => group.id !== groupId));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Discover Public Groups</h2>
      
      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {publicGroups.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No public groups available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            All groups are currently private or you've joined all available groups.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publicGroups.map((group) => (
            <li
              key={group.id}
              className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {group.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {group.description || 'No description'}
                </p>
                </div>
                <div className="px-6 py-4">
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Join Group
                  </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupDiscovery;