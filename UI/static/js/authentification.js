window.onload = function() {
  const loginBtn = document.getElementById('sign-in-switch');
  const registerBtn = document.getElementById('register-switch');
  const title = document.getElementById('login-title');

  registerBtn.onclick = function(event) {
    title.innerHTML = 'Create an Account';
  };
  loginBtn.onclick = function(event) {
    title.innerHTML = 'Sign In';
  };
};
