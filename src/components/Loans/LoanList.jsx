import { useState, useEffect } from 'react';
import { getUserLoans, getGroupLoans } from '../../services/LoanService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const LoanList = ({ mode = 'user' }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        let response;
        if (mode === 'group') {
          response = await getGroupLoans(groupId, activeTab.toLowerCase());
        } else {
          response = await getUserLoans(activeTab.toLowerCase());
        }
        setLoans(response.loans);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [mode, groupId, activeTab]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">
          {mode === 'group' ? 'Group Loans' : 'Your Loans'}
        </h2>
        
        <div className="flex space-x-1 rounded-md bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-1.5 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'active' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-1.5 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'pending' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`py-1.5 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'paid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-700'
            }`}
          >
            Paid
          </button>
        </div>
      </div>
      
      {error && <ErrorMessage message={error} />}

      {loans.length === 0 ? (
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No {activeTab.toLowerCase()} loans found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'pending' 
              ? 'When you request a loan, it will appear here'
              : activeTab === 'active'
              ? 'Your active loans will appear here'
              : 'Your paid loans will appear here'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {mode === 'group' ? 'Member' : 'Group'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {mode === 'group' ? loan.user_username : loan.group_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(loan.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${loan.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      loan.status === 'APPROVED' || loan.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                      loan.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${loan.outstanding_balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoanList;