import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLoanDetails, repayLoan } from '../../services/LoanService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { useNotification } from '../../context/NotificationContext';

const LoanDetails = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [repayLoading, setRepayLoading] = useState(false);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setLoading(true);
        const response = await getLoanDetails(loanId);
        setLoan(response.loan);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [loanId]);

  const handleRepayment = async (e) => {
    e.preventDefault();
    try {
      setRepayLoading(true);
      await repayLoan(loanId, { amount: parseFloat(repaymentAmount) });
      showNotification('Repayment processed successfully', 'success');
      // Refresh loan details
      const response = await getLoanDetails(loanId);
      setLoan(response.loan);
      setRepaymentAmount('');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setRepayLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!loan) {
    return <ErrorMessage message={error || 'Loan not found'} />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Loan Details</h2>
        <p className="text-gray-600 mb-6">ID: #{loan.id}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Group</p>
                <p className="text-sm font-medium">{loan.group_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className={`text-sm font-medium ${
                  loan.status === 'PENDING' ? 'text-yellow-600' :
                  loan.status === 'APPROVED' || loan.status === 'ACTIVE' ? 'text-blue-600' :
                  loan.status === 'PAID' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {loan.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Request Date</p>
                <p className="text-sm font-medium">{new Date(loan.created_at).toLocaleDateString()}</p>
              </div>
              {loan.approved_at && (
                <div>
                  <p className="text-xs text-gray-500">Approved Date</p>
                  <p className="text-sm font-medium">{new Date(loan.approved_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Financial Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Principal Amount</p>
                <p className="text-sm font-medium">${loan.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Interest Rate</p>
                <p className="text-sm font-medium">{loan.interest_rate}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Repayment</p>
                <p className="text-sm font-medium">${loan.total_repayment}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount Paid</p>
                <p className="text-sm font-medium">${loan.amount_paid}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Outstanding Balance</p>
                <p className="text-sm font-medium">${loan.outstanding_balance}</p>
              </div>
            </div>
          </div>
        </div>
        
        {loan.purpose && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Purpose</h3>
            <p className="text-sm text-gray-700">{loan.purpose}</p>
          </div>
        )}
      </div>

      {loan.status === 'ACTIVE' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Make a Repayment</h3>
          <form onSubmit={handleRepayment} className="space-y-4">
            <div>
              <label htmlFor="repaymentAmount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="repaymentAmount"
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  required
                  min="1"
                  max={loan.outstanding_balance}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <span className="text-gray-500 sm:text-sm pr-3">Max: {loan.outstanding_balance}</span>
                </div>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={repayLoading || !repaymentAmount || parseFloat(repaymentAmount) > loan.outstanding_balance}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {repayLoading ? 'Processing...' : 'Make Payment'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Repayment Schedule</h3>
        {loan.repayments && loan.repayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loan.repayments.map((repayment) => (
                  <tr key={repayment.id} className={repayment.is_overdue ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(repayment.due_date).toLocaleDateString()}
                      {repayment.is_overdue && (
                        <span className="ml-2 text-xs text-red-600">(Overdue)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${repayment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        repayment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        repayment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {repayment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repayment.paid_at ? new Date(repayment.paid_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No repayment schedule available.</p>
        )}
      </div>
    </div>
  );
};

export default LoanDetails;