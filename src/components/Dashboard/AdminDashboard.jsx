import { useState, useEffect } from 'react';
import { getPendingWithdrawals, getGroupWithdrawals } from '../../services/WithdrawalService';
import { getGroupLoans, approveLoan, rejectLoan } from '../../services/LoanService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import PendingWithdrawals from '../withdrawals/PendingWithdrawals';

const AdminDashboard = ({ groupId }) => {
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [allWithdrawals, setAllWithdrawals] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingWithdrawalsResp, allWithdrawalsResp] = await Promise.all([
          getPendingWithdrawals(groupId),
          getGroupWithdrawals(groupId),
        ]);
        
        const loansResp = await getGroupLoans(groupId, 'pending');
        
        setPendingWithdrawals(pendingWithdrawalsResp.pending_withdrawals);
        setAllWithdrawals(allWithdrawalsResp.withdrawal_requests);
        setPendingLoans(loansResp.loans || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  const handleWithdrawalProcessed = (withdrawalId, status) => {
    setPendingWithdrawals(pendingWithdrawals.filter(w => w.id !== withdrawalId));
    setAllWithdrawals(allWithdrawals.map(w => 
      w.id === withdrawalId ? { ...w, status } : w
    ));
  };

  const handleLoanAction = async (loanId, action) => {
    try {
      if (action === 'APPROVE') {
        await approveLoan(loanId);
      } else {
        const reason = prompt('Please enter rejection reason:');
        if (reason) {
          await rejectLoan(loanId, { reason });
        } else {
          return; // User cancelled
        }
      }
      
      setPendingLoans(pendingLoans.filter(loan => loan.id !== loanId));
    } catch (err) {
      setError(`Failed to ${action.toLowerCase()} loan: ${err.message}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
        <p className="text-gray-600">
          Manage group members, approve withdrawals and loans, and view group statistics.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <PendingWithdrawals 
        groupId={groupId} 
        onWithdrawalProcessed={handleWithdrawalProcessed}
      />

      {/* Pending Loans Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Pending Loan Requests
          {pendingLoans.length > 0 && (
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingLoans.length}
            </span>
          )}
        </h3>
        
        {pendingLoans.length === 0 ? (
          <p className="text-sm text-gray-500">No pending loan requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingLoans.map(loan => (
                  <tr key={loan.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {loan.user_username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                      ${loan.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {loan.purpose || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(loan.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {loan.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleLoanAction(loan.id, 'APPROVE')}
                            className="mr-2 text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleLoanAction(loan.id, 'REJECT')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Withdrawals Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">All Withdrawals</h3>
        {allWithdrawals.length === 0 ? (
          <p className="text-sm text-gray-500">No withdrawal requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allWithdrawals.map(withdrawal => (
                  <tr key={withdrawal.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {withdrawal.user_username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                      ${withdrawal.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        withdrawal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        withdrawal.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(withdrawal.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;