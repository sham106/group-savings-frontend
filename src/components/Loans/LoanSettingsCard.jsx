import { useState } from 'react';
import { updateGroupLoanSettings } from '../../services/LoanService';
import { useNotifications } from '../../context/NotificationContext';

const LoanSettingsCard = ({ groupId, initialSettings }) => {
  const [settings, setSettings] = useState(initialSettings || {
    max_loan_multiplier: 3.0,
    base_interest_rate: 10.0,
    min_repayment_period: 4,
    max_repayment_period: 12,
    late_penalty_rate: 2.0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotifications();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateGroupLoanSettings(groupId, settings);
      showNotification('Loan settings updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        <div className="p-2 rounded-full bg-indigo-100 mr-3">
          <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="font-medium text-gray-900">Loan Settings</h4>
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Loan Multiplier</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="10"
              name="max_loan_multiplier"
              value={settings.max_loan_multiplier}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="50"
              name="base_interest_rate"
              value={settings.base_interest_rate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Repayment (weeks)</label>
            <input
              type="number"
              min="1"
              max="52"
              name="min_repayment_period"
              value={settings.min_repayment_period}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Repayment (weeks)</label>
            <input
              type="number"
              min="1"
              max="52"
              name="max_repayment_period"
              value={settings.max_repayment_period}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Late Penalty Rate (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              name="late_penalty_rate"
              value={settings.late_penalty_rate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <div>
              <p className="font-medium">Max Loan:</p>
              <p>{settings.max_loan_multiplier}x savings</p>
            </div>
            <div>
              <p className="font-medium">Interest Rate:</p>
              <p>{settings.base_interest_rate}%</p>
            </div>
            <div>
              <p className="font-medium">Repayment Period:</p>
              <p>{settings.min_repayment_period}-{settings.max_repayment_period} weeks</p>
            </div>
            <div>
              <p className="font-medium">Late Penalty:</p>
              <p>{settings.late_penalty_rate}%</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Edit Settings
          </button>
        </>
      )}
    </div>
  );
};

export default LoanSettingsCard;