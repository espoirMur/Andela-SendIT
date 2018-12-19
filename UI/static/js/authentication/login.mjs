/* eslint-disable no-else-return */
/* eslint-disable no-use-before-define */
/* eslint-disable arrow-parens */

import fetchUrl from '../utils/fetch-ressources.mjs';

const _ = (id) => document.getElementById(id);
const loginForm = _('login-form');
// const authError = _('#auth-error');
const loginButton = _('login-btn');

const login = (event) => {
  event.preventDefault();
  event.target.checkValidity();
  cleanError();
  const formData = new FormData(loginForm);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  const dataJson = JSON.stringify(data);
  const url = '/auth/signin';
  fetchUrl(url, 'POST', dataJson)
    .then(async (successData) => {
      await localStorage.setItem('token', successData.token);
      await localStorage.setItem('user', successData.user);
      if (successData.user.isadmin) {
        window.location = '/admin.html';
      } else {
        window.location = '/orders.html';
      }
    })
    .catch((errorData) => {
      _('error-login').style.cssText = 'display:block;color:red';
      _('error-login').innerHTML = errorData.message;
    });
};


loginButton.addEventListener('click', login);

const cleanError = () => {
  _('error-login').style.cssText = 'display:none';
  _('error-login').innerHTML = '';
};
