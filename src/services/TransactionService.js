import api from './api';

export const contributeToGroup = async (contributionData) => {
  try {
    const response = await api.post('/api/transactions/contribute', contributionData);
    return response.data;
  } catch (error) {
    throw new Error(error.errors ? Object.values(error.errors).join(' ') : error.error || 'Failed to contribute');
  }
};

export const getGroupTransactions = async (groupId, page = 1, perPage = 20) => {
  try {
    const response = await api.get(`/api/transactions/group/${groupId}/transactions`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch group transactions');
  }
};

export const getUserTransactions = async (page = 1, perPage = 20) => {
  try {
    const response = await api.get('/api/transactions/user/transactions', {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch user transactions');
  }
};

export const getGroupStats = async (groupId) => {
  try {
    const response = await api.get(`/api/transactions/group/${groupId}/stats`);
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch group statistics');
  }
};


export const initiateMpesaContribution = async (groupId, { amount, phone_number }) => {
  try {
    const response = await fetch(`/api/groups/${groupId}/contribute/mpesa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        amount,
        phone_number: `254${phone_number}` // Convert to 254 format
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('M-Pesa Contribution Error:', error); // Log error details
      throw new Error(error.error || 'Failed to initiate M-Pesa payment');
    }

    return response.json();
  } catch (error) {
    console.error('Network or Server Error:', error.message); // Log network or server errors
    throw new Error('An unexpected error occurred while initiating M-Pesa payment.');
  }
};