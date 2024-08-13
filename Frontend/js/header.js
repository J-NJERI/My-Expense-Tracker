document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutBtn');
    const userStatus = document.getElementById('userStatus');
    
    // Check if the user is logged in
    const checkLoginStatus = () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            // User is logged in
            userStatus.textContent = `Welcome, User ${userId}`;
            logoutButton.style.display = 'block';
        } else {
            // User is not logged in
            userStatus.textContent = 'You are not logged in.';
            logoutButton.style.display = 'none';
        }
    };

    // Handle logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('userId');
            userStatus.textContent = 'You have been logged out.';
            logoutButton.style.display = 'none';
            // Optionally redirect to login page
            window.location.href = 'login.html';
        });
    }

    // Initial check
    checkLoginStatus();
});
