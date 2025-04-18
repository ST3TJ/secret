document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const message = document.getElementById('message');
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');

    const API_URL = 'https://banan.pythonanywhere.com/login';

    function showMessage(text, type) {
        message.textContent = text;
        message.className = type;

        setTimeout(() => {
            message.textContent = '';
            message.className = '';
        }, 3000);
    }

    loginButton.addEventListener('click', async () => {
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        if (!login || !password) {
            showMessage('Invalid login or password', 'error');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: login,
                    password: password,
                }),
            });

            const data = await response.json();

            const message = data.message || 'Unknown error';
            const status = data.status;

            if (!response.ok) {
                throw new Error('Server error');
            }

            showMessage(message, status)

        } catch (error) {
            console.error('Error:', error);
            showMessage(error.message || 'Error occurred', 'error');
        }
    });
});