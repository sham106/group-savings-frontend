// src/utils/notifications.js
export const showNotification = (message, type = 'info') => {
    // Use browser alert as fallback
    if (type === 'error') {
        alert(`Error: ${message}`);
    } else {
        alert(message);
    }
    // In a real app, you would use a proper notification system here
};