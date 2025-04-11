import { useState, useEffect } from 'react';
import { getGroupMembers, makeGroupAdmin } from '../../services/GroupService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const GroupMembers = ({ groupId, isAdmin }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getGroupMembers(groupId);
        setMembers(response.members);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleMakeAdmin = async (userId) => {
    if (window.confirm('Are you sure you want to make this member an admin?')) {
      try {
        await makeGroupAdmin(groupId, userId);
        setMembers(members.map(member => 
          member.id === userId ? { ...member, is_admin: true } : member
        ));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Group Members</h2>
        <span className="text-sm text-gray-500">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </span>
      </div>

      {error && <ErrorMessage message={error} />}

      <ul className="divide-y divide-gray-200">
        {members.map((member) => (
          <li key={member.id} className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {member.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {member.username}
                  </p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {member.is_admin && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Admin
                  </span>
                )}
                {isAdmin && !member.is_admin && member.id !== user?.id && (
                  <button
                    onClick={() => handleMakeAdmin(member.id)}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                  >
                    Make Admin
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupMembers;