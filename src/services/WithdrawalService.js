import api from './api';

export const requestWithdrawal = async (withdrawalData) => {
  try {
    const response = await api.post('/api/withdrawals/request', withdrawalData);
    return response.data;
  } catch (error) {
    throw new Error(error.errors ? Object.values(error.errors).join(' ') : error.error || 'Failed to request withdrawal');
  }
};

export const getPendingWithdrawals = async (groupId) => {
  try {
    const response = await api.get(`/api/withdrawals/pending/${groupId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch pending withdrawals');
  }
};

// Updated error handling to provide more detailed error messages
export const processWithdrawal = async (withdrawalId, actionData) => {
  try {
    console.log('Processing withdrawal with payload:', {
      withdrawalId,
      actionData
    });

    const response = await api.post(`/api/withdrawals/${withdrawalId}/action`, {
      status: actionData.status,  // 'approved' or 'rejected'
      admin_comment: actionData.admin_comment || ''  // Ensure this matches the backend schema
    });

    return response.data;
  } catch (error) {
    console.error('Full error object:', error.response?.data || error);

    // Improved error handling
    const errorMessage = error.response?.data?.details || 
                        error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'Failed to process withdrawal';

    throw new Error(errorMessage);
  }
};

export const getUserWithdrawals = async () => {
  try {
    const response = await api.get('/api/withdrawals/user');
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch user withdrawals');
  }
};

export const getWithdrawalStatus = async (withdrawalId) => {
  try {
    const response = await api.get(`/api/withdrawals/${withdrawalId}/status`);
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch withdrawal status');
  }
};

export const getGroupWithdrawals = async (groupId) => {
  try {
    const response = await api.get(`/api/withdrawals/group/${groupId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch group withdrawals');
  }
};

export const getUserAvailableBalance = async (groupId) => {
  try {
    const response = await api.get(`/api/withdrawals/user/available-balance/${groupId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch available balance');
  }
};