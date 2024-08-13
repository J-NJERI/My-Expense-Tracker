document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const formData = new FormData(registerForm);
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
            };
            
            // console.log('Form Data:', data);

            try {
                const response = await fetch('http://localhost:5000/api/v1/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                
                const result = await response.json();

                if (response.ok) {
                    alert('Registration successful!');
                    window.location.href = 'login.html'; 
                } else {
                    console.error('Registration failed:', result.message);
                    alert(`Registration failed: ${result.message}`);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});
