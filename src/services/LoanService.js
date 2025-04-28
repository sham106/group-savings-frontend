import api from './api';

export const getLoanSettings = async (groupId) => {
  const response = await api.get(`/api/loans/settings?group_id=${groupId}`);
  return response.data;
};

export const updateGroupLoanSettings = async (groupId, settings) => {
  const response = await api.put('/api/loans/settings', { group_id: groupId, ...settings });
  return response.data;
};

export const checkLoanEligibility = async (groupId) => {
  try {
    // 1. Get the JWT token from wherever you store it (localStorage, context, etc.)
    const token = localStorage.getItem('token'); // or from your auth context
    
    // 2. Make the request with proper headers
    const response = await api.get(`/api/loans/eligibility?group_id=${groupId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // 3. Handle the response
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data?.error || 'Failed to check eligibility');
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.error(`Loan settings not found for group ${groupId}`);
      throw new Error(
        `Loan settings not found for group ${groupId}. Please ensure that loan settings are configured for this group in the backend.`
      );
    }
    console.error('Eligibility check error:', error);
    throw new Error(
      error.response?.data?.error || 'An unknown error occurred while checking loan eligibility.'
    );
  }
};

export const requestLoan = async (loanData) => {
  try {
    const response = await api.post('/api/loans/request', loanData, {
      validateStatus: (status) => status < 500
    });
    
    if (response.status >= 400) {
      throw new Error(response.data.error || 'Request failed');
    }
    
    return response.data;
  } catch (error) {
    console.error('Loan request error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserLoans = async (status = '') => {
  try {
    // Ensure the status matches the backend's LoanStatus enum
    const validStatuses = ['pending', 'approved', 'rejected', 'active', 'paid', 'defaulted'];
    const normalizedStatus = validStatuses.includes(status.toLowerCase()) ? status.toLowerCase() : '';
    const response = await api.get(`/api/loans/user?status=${normalizedStatus}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred while fetching user loans';
    console.error(`Failed to fetch user loans: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

export const getGroupLoans = async (groupId, status = '') => {
  try {
    // Ensure the status matches the backend's LoanStatus enum
    const validStatuses = ['pending', 'approved', 'rejected', 'active', 'paid', 'defaulted'];
    const normalizedStatus = validStatuses.includes(status.toLowerCase()) ? status.toLowerCase() : '';
    const response = await api.get(`/api/loans/group/${groupId}?status=${normalizedStatus}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch group loans for group ${groupId}:`, error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || 'An unknown error occurred while fetching loans');
  }
};

export const getLoanDetails = async (loanId) => {
  const response = await api.get(`/api/loans/${loanId}`);
  return response.data;
};

export const approveLoan = async (loanId) => {
  const response = await api.post(`/api/loans/${loanId}/approve`);
  return response.data;
};

export const rejectLoan = async (loanId, data) => {
  const response = await api.post(`/api/loans/${loanId}/reject`, data);
  return response.data;
};

export const repayLoan = async (loanId, data) => {
  const response = await api.post(`/api/loans/${loanId}/repay`, data);
  return response.data;
};
