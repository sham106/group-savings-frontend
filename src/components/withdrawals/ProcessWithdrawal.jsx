import { useState } from 'react';
import { processWithdrawal } from '../../services/WithdrawalService';
import ErrorMessage from '../common/ErrorMessage';

const ProcessWithdrawal = ({ withdrawalId, groupId, onProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState('');

  const handleProcess = async (status) => {
    setIsProcessing(true);
    setError(null);

    try {
      await processWithdrawal(withdrawalId, {
        status,
        admin_comment: comment,
      });
      onProcessed?.(withdrawalId, status);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
      setShowForm(false);
    }
  };

  return (
    <div className="relative">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={isProcessing}
        >
          Process
        </button>
      ) : (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-3 border border-gray-200">
          {error && <ErrorMessage message={error} />}
          <div className="mb-3">
            <label
              htmlFor="comment"
              className="block text-xs font-medium text-gray-700"
            >
              Comment (Optional)
            </label>
            <input
              id="comment"
              name="comment"
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleProcess('APPROVED')}
              className="flex-1 inline-flex justify-center items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              disabled={isProcessing}
            >
              Approve
            </button>
            <button
              onClick={() => handleProcess('REJECTED')}
              className="flex-1 inline-flex justify-center items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              disabled={isProcessing}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessWithdrawal;