import { useState } from 'react';
import { requestLoan, checkLoanEligibility } from '../../services/LoanService';
import { useNotifications } from '../../context/NotificationContext';
import { showNotification } from '../../utils/notification';

const LoanRequestForm = ({ groupId, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    duration_weeks: 8,
    purpose: ''
  });
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  // const { showNotification } = useNotifications();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckEligibility = async () => {
    try {
      setCheckingEligibility(true);
      const response = await checkLoanEligibility(groupId);
      setEligibility(response);
      showNotification('Eligibility checked successfully', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await requestLoan({
        group_id: groupId,
        ...formData
      });
      showNotification('Loan request submitted successfully', 'success');
      onSuccess?.();
      setFormData({
        amount: '',
        duration_weeks: 8,
        purpose: ''
      });
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 md:p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Request a Loan</h3>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-blue-800">Your Eligibility</h4>
            <p className="text-xs text-blue-600">
              {eligibility ? `You can borrow up to ${eligibility.eligible_amount}` : 'Check your eligible loan amount'}
            </p>
          </div>
          <button
            onClick={handleCheckEligibility}
            disabled={checkingEligibility}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {checkingEligibility ? 'Checking...' : 'Check Eligibility'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Loan Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              required
              min="1"
              max={eligibility?.eligible_amount || ''}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <span className="text-gray-500 sm:text-sm pr-3">Max: {eligibility?.eligible_amount || 'N/A'}</span>
            </div>
          </div>
          {eligibility && formData.amount > eligibility.eligible_amount && (
            <p className="mt-1 text-sm text-red-600">
              Amount exceeds your eligible limit of {eligibility.eligible_amount}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="duration_weeks" className="block text-sm font-medium text-gray-700">
            Repayment Period (weeks)
          </label>
          <input
            type="number"
            name="duration_weeks"
            id="duration_weeks"
            value={formData.duration_weeks}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            min={eligibility?.min_repayment_period || 4}
            max={eligibility?.max_repayment_period || 12}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Must be between {eligibility?.min_repayment_period || 4} and {eligibility?.max_repayment_period || 12} weeks
          </p>
        </div>

        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
            Purpose (optional)
          </label>
          <textarea
            name="purpose"
            id="purpose"
            rows={3}
            value={formData.purpose}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="What will you use this loan for?"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || (eligibility && formData.amount > eligibility.eligible_amount)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Loan Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanRequestForm;