import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroupMembers, addGroupMember, removeGroupMember, promoteToAdmin } from '../../services/GroupService';
import { searchUsers } from '../../services/Userservice';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ManageMembers = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
        try {
          const response = await getGroupMembers(groupId);
          if (!response || !response.members) {
            throw new Error('Invalid response structure from server');
          }
          // Filter out any null members
          const validMembers = response.members.filter(member => member !== null);
          setMembers(validMembers);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

    fetchMembers();
  }, [groupId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchUsers(searchQuery);
      const filteredResults = Array.isArray(results) ? results.filter(
        (result) => !members.some((member) => member.id === result.id)
      ) : [];
      setSearchResults(filteredResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await addGroupMember(groupId, userId);
      // Refresh members list
      const response = await getGroupMembers(groupId);
      setMembers(response.members);
      // Clear search results for this user
      setSearchResults(searchResults.filter(user => user.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await removeGroupMember(groupId, userId);
        // Refresh members list
        const response = await getGroupMembers(groupId);
        setMembers(response.members);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    if (window.confirm('Are you sure you want to promote this member to admin?')) {
      try {
        await promoteToAdmin(groupId, userId);
        // Refresh members list
        const response = await getGroupMembers(groupId);
        setMembers(response.members);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Manage Group Members</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Add Member Section */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Members</h3>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or email"
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Search Results</h4>
            <ul className="divide-y divide-gray-200">
              {searchResults.map((result) => (
                <li key={result.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{result.username}</p>
                    <p className="text-sm text-gray-500">{result.email}</p>
                  </div>
                  <button
                    onClick={() => handleAddMember(result.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add to Group
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Current Members Section */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Members</h3>
        {members.length === 0 ? (
          <p className="text-gray-500">No members in this group yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {members.map((member) => (
              <li key={member.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 text-lg">
                        {member.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.username}
                        {member.is_admin && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Admin
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!member.is_admin && (
                      <button
                        onClick={() => handlePromoteToAdmin(member.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Make Admin
                      </button>
                    )}
                    {member.id !== user.id && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageMembers;