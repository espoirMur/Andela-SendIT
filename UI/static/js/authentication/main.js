window.onload = () => {
  const loginBtn = document.getElementById('sign-in-switch');
  const registerBtn = document.getElementById('register-switch');
  const title = document.getElementById('login-title');

  registerBtn.onclick = () => {
    title.innerHTML = 'Create an Account';
  };
  loginBtn.onclick = () => {
    title.innerHTML = 'Sign In';
  };
};
