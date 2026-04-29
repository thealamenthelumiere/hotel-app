const TOKEN_KEY = 'access_token';

window.api = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  async fetch(url, options = {}) {
    const token = this.getToken();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
  },
};

// Очищаем токен при клике на "Выйти"
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href="/auth/logout"]').forEach((link) => {
    link.addEventListener('click', () => window.api.removeToken());
  });
});
