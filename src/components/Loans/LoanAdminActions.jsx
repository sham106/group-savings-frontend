import { useState } from 'react';
import { approveLoan, rejectLoan } from '../../services/LoanService';
import { useNotification } from '../../context/NotificationContext';

const LoanAdminActions = ({ loanId, onAction }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { showNotification } = useNotification();

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await approveLoan(loanId);
      showNotification('Loan approved successfully', 'success');
      onAction?.('approved');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      showNotification('Please provide a reason for rejection', 'error');
      return;
    }
    
    try {
      setIsRejecting(true);
      await rejectLoan(loanId, { reason: rejectionReason });
      showNotification('Loan rejected successfully', 'success');
      onAction?.('rejected');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setIsRejecting(false);
      setRejectionReason('');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Loan Approval</h3>
      
      <div className="flex space-x-3">
        <button
          onClick={handleApprove}
          disabled={isApproving}
          className="flex-1 py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isApproving ? 'Approving...' : 'Approve Loan'}
        </button>
        
        <button
          onClick={() => document.getElementById('rejectionModal').showModal()}
          disabled={isRejecting}
          className="flex-1 py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          Reject Loan
        </button>
      </div>

      {/* Rejection Reason Modal */}
      <dialog id="rejectionModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Reject Loan Request</h3>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for rejection (required)
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
              placeholder="Provide a reason for rejecting this loan request..."
            />
          </div>
          <div className="modal-action">
            <form method="dialog" className="flex space-x-2">
              <button
                onClick={handleReject}
                disabled={isRejecting || !rejectionReason}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default LoanAdminActions;