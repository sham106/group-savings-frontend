import { useState, useEffect } from 'react';
import { requestWithdrawal, getUserAvailableBalance } from '../../services/WithdrawalService';
import ErrorMessage from '../common/ErrorMessage';

const WithdrawalRequestForm = ({ groupId }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);

  useEffect(() => {
    const fetchAvailableBalance = async () => {
      try {
        const response = await getUserAvailableBalance(groupId);
        setAvailableBalance(response.available_balance);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAvailableBalance();
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await requestWithdrawal({
        group_id: groupId,
        amount: parseFloat(amount),
        description,
      });
      setSuccess(true);
      setAmount('');
      setDescription('');
      // Refresh available balance
      const response = await getUserAvailableBalance(groupId);
      setAvailableBalance(response.available_balance);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Request Withdrawal</h2>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          Available balance: <span className="font-medium">Ksh.{availableBalance}</span>
        </p>
      </div>
      
      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Withdrawal request submitted!</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm"></span>
            </div>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              max={availableBalance}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">Ksh</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Maximum: Ksh.{availableBalance}
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>
          <div className="mt-1">
            <input
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g. Emergency funds"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            disabled={availableBalance <= 0}
          >
            Request Withdrawal
          </button>
        </div>
      </form>
    </div>
  );
};

export default WithdrawalRequestForm;