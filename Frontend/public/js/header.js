document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutBtn');
    const userStatus = document.getElementById('userStatus');
    
    if (!logoutButton || !userStatus) {
        console.error('Required elements not found: logoutBtn or userStatus');
        return;
    }
    // Check if the user is logged in
    const checkLoginStatus = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            userStatus.textContent = 'You are logged in.';
            logoutButton.style.display = 'block';
        } else {
            userStatus.textContent = 'You are not logged in.';
            logoutButton.style.display = 'none';
        }
    };

    // Handle logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            userStatus.textContent = 'You have been logged out.';
            logoutButton.style.display = 'none';
            // Optionally redirect to login page
            window.location.href = 'login.html';
        });
    }

    // Initial check
    checkLoginStatus();
});
