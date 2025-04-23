document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const loginContainer = document.getElementById('login-container');
    const loadingContainer = document.getElementById('loading-container');

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

    const savedSession = getCookie('session');
    const savedKey = getCookie('key');

    if (savedSession) {
        const response = fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session: savedSession,
                key: savedKey,
            }),
        });

        response.then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Server error');
            }

            if (data.status === 'success') {
                loginContainer.classList.add('hidden');
                content.innerHTML = data.content;
            } else {
                showMessage(data.message, data.status);
            }
        }).catch((error) => {
            console.error('Error:', error);
            showMessage(error.message || 'Error occurred', 'error');
        }).finally(() => {
            loadingContainer.classList.add('hidden');
        });
    } else {
        loadingContainer.classList.add('hidden');
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

            if (data.status === 'success') {
                loginContainer.classList.add('hidden');
                content.innerHTML = data.content;

                if (data.session) {
                    document.cookie = `session=${data.session};`;
                    document.cookie = `key=${data.key};`;
                }
            } else {
                showMessage(data.message, data.status);
            }

        } catch (error) {
            console.error('Error:', error);
            showMessage(error.message || 'Error occurred', 'error');
        }
    });
});