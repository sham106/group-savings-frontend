import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroupDetails, leaveGroup } from '../../services/GroupService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import GroupStats from '../Transactions/GroupStats';
import GroupSettingsModal from './GroupSettingsModal';
import GroupMembers from './GroupMembers';
import GroupTransactions from '../Transactions/GroupTransactions';
import WithdrawalRequestForm from '../withdrawals/WithdrawalRequestForm';
import PendingWithdrawals from '../withdrawals/PendingWithdrawals';
import ContributionForm from '../Transactions/ContributionForm';
import WithdrawalList from '../withdrawals/WithdrawalList';

const GroupDetails = () => {
  const { groupId } = useParams();
  const { user, isAdmin } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showWithdrawals, setShowWithdrawals] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await getGroupDetails(groupId);
        setGroup(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleLeaveGroup = async () => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      try {
        await leaveGroup(groupId);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleManageMembers = () => {
    navigate(`/groups/${groupId}/manage-members`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!group) {
    return <ErrorMessage message={error || 'Group not found'} />;
  }

  const handleSaveGroup = async (updatedGroup) => {
    try {
      // Update the group state with the new data
      setGroup((prevGroup) => ({
        ...prevGroup,
        ...updatedGroup,
      }));
      setShowSettingsModal(false); // Close the modal
    } catch (err) {
      setError('Failed to save group settings');
    }
  };

  const progressPercentage = Math.round((group.current_amount / group.target_amount) * 100);
  
  // Check if user is admin of the group
  const userIsAdmin = isAdmin(group);

  // Ensure the activeTab is set to 'members' when navigating to the members page
  const handleNavigateToMembers = () => {
    setActiveTab('members');
    navigate(`/dashboard/group/${groupId}/members`);
  };

  return (
    <div className="space-y-6">
      {showSettingsModal && (
        <GroupSettingsModal 
          group={group} 
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSaveGroup} 
        />
      )}
      
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{group.name}</h2>
            <p className="mt-1 text-sm sm:text-base text-gray-600">{group.description}</p>
          </div>
          {userIsAdmin && (
            <span className="mt-2 sm:mt-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Admin
            </span>
          )}
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(progressPercentage, 100)}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600">
            <span>Current: {group.current_amount}</span>
            <span>Target: {group.target_amount}</span>
            <span>{progressPercentage}%</span>
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <button
            onClick={handleLeaveGroup}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Leave Group
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-2 sm:space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`${
              activeTab === 'members'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`${
              activeTab === 'withdrawals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors`}
          >
            My Withdrawals
          </button>
          {userIsAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`${
                activeTab === 'admin'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors`}
            >
              Admin Tools
              <span className="ml-1 inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Admin
              </span>
            </button>
          )}
        </nav>
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            <GroupStats groupId={groupId} />
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 md:grid-cols-2">
              <ContributionForm groupId={groupId} />
              <WithdrawalRequestForm groupId={groupId} />
            </div>
          </>
        )}

        {activeTab === 'transactions' && (
          <GroupTransactions groupId={groupId} />
        )}

        {activeTab === 'members' && (
          <GroupMembers groupId={groupId} isAdmin={userIsAdmin} />
        )}
        
        {activeTab === 'withdrawals' && (
          <WithdrawalList />
        )}

        {activeTab === 'admin' && userIsAdmin && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Tools</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Group Management Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-blue-100 mr-3">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Member Management</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">Add, remove, or promote group members</p>
                  <button
                    onClick={handleManageMembers}
                    className="w-full py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Manage Members
                  </button>
                </div>
                
                {/* Group Settings Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-purple-100 mr-3">
                      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Group Settings</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">Update group name, description, or target</p>
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="w-full py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    Edit Settings
                  </button>
                </div>
                
                {/* Withdrawal Approvals Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-green-100 mr-3">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Withdrawal Approvals</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">Review and process pending withdrawal requests</p>
                  <button
                    onClick={() => {
                      setActiveTab('admin-withdrawals');
                      setShowWithdrawals(true);
                    }}
                    className="w-full py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    View Requests
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Withdrawals section */}
        {activeTab === 'admin-withdrawals' && showWithdrawals && userIsAdmin && (
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Pending Withdrawals</h3>
              <button 
                onClick={() => {
                  setActiveTab('admin');
                  setShowWithdrawals(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                ← Back to Admin Tools
              </button>
            </div>
            <PendingWithdrawals groupId={groupId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;