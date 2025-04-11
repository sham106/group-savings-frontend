import api from './api';

export const initiateSTKPush = async (paymentData) => {
  try {
    const response = await api.post('/api/payments/stk-push', paymentData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Payment initiation failed');
    }
    throw new Error('Network error occurred while initiating payment');
  }
};