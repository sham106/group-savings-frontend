// import api from '../services/api';

// export const getLoanSettings = async (groupId) => {
//   const response = await api.get(`/loans/settings?group_id=${groupId}`);
//   return response.data;
// };

// export const updateGroupLoanSettings = async (groupId, settings) => {
//   const response = await api.put('/loans/settings', { group_id: groupId, ...settings });
//   return response.data;
// };

// export const checkLoanEligibility = async (groupId) => {
//   const response = await api.get(`/loans/eligibility?group_id=${groupId}`);
//   return response.data;
// };

// export const requestLoan = async (loanData) => {
//   const response = await api.post('/loans/request', loanData);
//   return response.data;
// };

// export const getUserLoans = async (status = '') => {
//   const response = await api.get(`/loans/user?status=${status}`);
//   return response.data;
// };

// export const getGroupLoans = async (groupId, status = '') => {
//   const response = await api.get(`/loans/group/${groupId}?status=${status}`);
//   return response.data;
// };

// export const getLoanDetails = async (loanId) => {
//   const response = await api.get(`/loans/${loanId}`);
//   return response.data;
// };

// export const approveLoan = async (loanId) => {
//   const response = await api.post(`/loans/${loanId}/approve`);
//   return response.data;
// };

// export const rejectLoan = async (loanId, data) => {
//   const response = await api.post(`/loans/${loanId}/reject`, data);
//   return response.data;
// };

// export const repayLoan = async (loanId, data) => {
//   const response = await api.post(`/loans/${loanId}/repay`, data);
//   return response.data;
// };