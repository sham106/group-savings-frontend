import api from './api';

export const createGroup = async (groupData) => {
  try {
    const response = await api.post('/api/groups/', groupData);
    return response.data;
  } catch (error) {
    throw new Error(error.errors ? Object.values(error.errors).join(' ') : error.error || 'Failed to create group');
  }
};

export const getUserGroups = async () => {
  try {
    const response = await api.get('/api/groups/');
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch user groups');
  }
};

export const getGroupDetails = async (groupId) => {
  try {
    const response = await api.get(`/api/groups/${groupId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch group details');
  }
};

export const joinGroup = async (groupId) => {
  try {
    // Make sure groupId is a number
    const payload = { group_id: Number(groupId) };
    console.log('Joining with payload:', payload);
    const response = await api.post('/api/groups/join', payload);
    return response.data;
  } catch (error) {
    console.error('Join error full:', error);
    console.error('Response data:', error.response?.data);
    throw new Error(error.response?.data?.error || 
                   (error.response?.data?.errors ? 
                     JSON.stringify(error.response.data.errors) : 
                     'Failed to join group'));
  }
};

export const leaveGroup = async (groupId) => {
  try {
    const response = await api.post(`/api/groups/${groupId}/leave`);
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to leave group');
  }
};

export const getGroupMembers = async (groupId) => {
  try {
    const response = await api.get(`/api/groups/${groupId}/members`);
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch group members');
  }
};

// export const addGroupMember = async (groupId, userId) => {
//   try {
//     const response = await api.post(`/api/groups/${groupId}/members`, { user_id: userId });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.error || 'Failed to add group member');
//   }
// };

export const makeGroupAdmin = async (groupId, userId) => {
  try {
    const response = await api.post(`/api/groups/${groupId}/admin/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to make user admin');
  }
};

export const getPublicGroups = async () => {
  try {
    const response = await api.get('/api/groups/discover');
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch public groups');
  }
};

//YET TO IMPLEMENT THE BACKEND FOR THIS
export const updateGroup = async (groupId, groupData) => {
  try {
    const response = await api.put(`/api/groups/${groupId}`, groupData);
    return response.data.group;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update group');
  }
};

export const addMember = async (groupId, email) => {
  const response = await fetch(`/api/groups/${groupId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to add member');
  }

  return await response.json();
};

export const removeMember = async (groupId, memberId) => {
  const response = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to remove member');
  }

  return await response.json();
};

export const promoteMember = async (groupId, memberId) => {
  const response = await fetch(`/api/groups/${groupId}/members/${memberId}/promote`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to promote member');
  }

  return await response.json();
};


// export const getGroupMembers = async (groupId) => {
//   const response = await fetch(`/api/groups/${groupId}/members`, {
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('token')}`,
//     },
//   });
//   if (!response.ok) {
//     throw new Error('Failed to fetch group members');
//   }
//   return response.json();
// };

export const addGroupMember = async (groupId, userId) => {
  const response = await fetch(`/api/groups/${groupId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!response.ok) {
    throw new Error('Failed to add member');
  }
  return response.json();
};

export const removeGroupMember = async (groupId, userId) => {
  const response = await fetch(`/api/groups/${groupId}/members/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to remove member');
  }
  return response.json();
};

export const promoteToAdmin = async (groupId, userId) => {
  const response = await fetch(`/api/groups/${groupId}/promote/${userId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to promote member');
  }
  return response.json();
};