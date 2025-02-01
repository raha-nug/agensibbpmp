document.querySelector('.toggle-password').addEventListener('click', function () {
    const passwordInput = document.querySelector('.password-group input');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '👁️🗨️';
});
