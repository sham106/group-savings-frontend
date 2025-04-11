export const searchUsers = async (query) => {
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to search users');
    }
    return response.json();
  };