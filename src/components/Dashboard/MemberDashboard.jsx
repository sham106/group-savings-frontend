import { useState, useEffect } from 'react';
import { getUserAvailableBalance, getUserWithdrawals } from '../../services/WithdrawalService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import WithdrawalList from '../withdrawals/WithdrawalList';

const MemberDashboard = ({ groupId }) => {
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [balanceResponse, withdrawalsResponse] = await Promise.all([
          getUserAvailableBalance(groupId),
          getUserWithdrawals()
        ]);
        
        setAvailableBalance(balanceResponse.available_balance);
        // Filter pending withdrawals from all withdrawals
        const pending = withdrawalsResponse.withdrawal_requests.filter(
          withdrawal => withdrawal.status === 'PENDING'
        );
        setPendingWithdrawals(pending);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [groupId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Member Dashboard</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800">Available Balance</h3>
            <p className="mt-2 text-2xl font-semibold text-blue-600">
              ${availableBalance}
            </p>
            <p className="mt-1 text-xs text-blue-600">
              This is the amount you can withdraw based on your contributions.
            </p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800">Pending Withdrawals</h3>
            <p className="mt-2 text-2xl font-semibold text-yellow-600">
              {pendingWithdrawals.length}
            </p>
            <p className="mt-1 text-xs text-yellow-600">
              You have {pendingWithdrawals.length} pending withdrawal {pendingWithdrawals.length === 1 ? 'request' : 'requests'}
            </p>
          </div>
        </div>
        
        {/* Recent Pending Withdrawals Section */}
        {pendingWithdrawals.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Pending Withdrawals</h3>
            <div className="bg-gray-50 rounded-md p-3 divide-y divide-gray-200">
              {pendingWithdrawals.slice(0, 3).map(withdrawal => (
                <div key={withdrawal.id} className="py-2 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        ${withdrawal.amount} from {withdrawal.group_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(withdrawal.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      PENDING
                    </span>
                  </div>
                </div>
              ))}
              {pendingWithdrawals.length > 3 && (
                <div className="pt-2 text-center">
                  <span className="text-xs text-purple-600 font-medium">
                    +{pendingWithdrawals.length - 3} more pending
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Full withdrawal list */}
      <WithdrawalList />
    </div>
  );
};

export default MemberDashboard;