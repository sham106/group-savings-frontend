import { useState, useEffect } from 'react';
import { getGroupStats } from '../../services/TransactionService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const GroupStats = ({ groupId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getGroupStats(groupId);
        setStats(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [groupId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!stats) {
    return <ErrorMessage message={error || 'Failed to load group statistics'} />;
  }

  // Safely handle missing data
  const safeTopContributors = stats.top_contributors || [];
  const safeRecentTransactions = stats.recent_transactions || [];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Group Statistics</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800">Total Contributions</h3>
          <p className="mt-2 text-2xl font-semibold text-blue-600">
            Ksh.{stats.total_contributions || 0}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-800">Total Withdrawals</h3>
          <p className="mt-2 text-2xl font-semibold text-purple-600">
            Ksh.{stats.total_withdrawals || 0}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800">Current Savings</h3>
          <p className="mt-2 text-2xl font-semibold text-green-600">
            Ksh.{stats.current_amount || 0}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Top Contributors</h3>
        <ul className="divide-y divide-gray-200">
          {safeTopContributors.map((contributor, index) => (
            <li key={contributor.user_id || index} className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {contributor.username || 'Unknown user'}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium text-green-600">
                  Ksh.{contributor.total_contribution || 0}
                </div>
              </div>
            </li>
          ))}
          {safeTopContributors.length === 0 && (
            <li className="py-3 text-sm text-gray-500">No contributors yet</li>
          )}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Transactions</h3>
        <ul className="divide-y divide-gray-200">
          {safeRecentTransactions.map((transaction) => (
            <li key={transaction.id} className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-800">
                      {(transaction.user_username || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.user?.username || 'Unknown user'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.timestamp ? new Date(transaction.timestamp).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-sm font-medium ${
                    transaction.transaction_type === 'CONTRIBUTION'
                      ? 'text-green-600'
                      : 'text-purple-600'
                  }`}
                >
                  Ksh.{transaction.amount || 0}
                </div>
              </div>
            </li>
          ))}
          {safeRecentTransactions.length === 0 && (
            <li className="py-3 text-sm text-gray-500">No recent transactions</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroupStats;