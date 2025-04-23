document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const loginContainer = document.getElementById('login-container');
    const message = document.getElementById('message');
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    const content = document.getElementById('content');

    const API_URL = 'https://banan.pythonanywhere.com/login';

    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
            if (cookieName === name) {
                return cookieValue;
            }
        }
        return null;
    }

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
            const savedSession = getCookie('session');

            const response = await fetch(API_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: login,
                    password: password,
                    session: savedSession,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Server error');
            }

            showMessage(data.message, data.status);

            if (data.status === 'success') {
                loginContainer.classList.add('hidden');
                content.classList.remove('hidden');

                if (data.session) {
                    document.cookie = `session=${data.session};`;
                }
            }

        } catch (error) {
            console.error('Error:', error);
            showMessage(error.message || 'Error occurred', 'error');
        }
    });
});