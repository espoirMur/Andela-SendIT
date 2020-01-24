/* eslint-disable no-else-return */
/* eslint-disable no-use-before-define */
/* eslint-disable arrow-parens */

import fetchUrl from '../utils/fetch-ressources.mjs';

const _ = (id) => document.getElementById(id);
const registerForm = _('register-form');
const registerButton = _('register-btn');

const register = (event) => {
  event.preventDefault();
  event.target.checkValidity();
  cleanError();
  const formData = new FormData(registerForm);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  const dataJson = JSON.stringify(data);
  const url = '/auth/signup';
  fetchUrl(url, 'POST', dataJson)
    .then(async (successData) => {
      await localStorage.setItem('token', successData.token);
      window.location = '/orders.html';
    })
    .catch((errorData) => {
      _('error-register').style.cssText = 'display:block;color:red';
      _('error-register').innerHTML = errorData.message;
    });
};

registerButton.addEventListener('click', register);

const cleanError = () => {
  _('error-register').style.cssText = 'display:none';
  _('error-register').innerHTML = '';
};

const checkPassword = () => {
  if (
    _('register-password-confirmation').value === _('register-password').value
  ) {
    _('error-register').style.cssText = 'display:block;color:green';
    _('error-register').innerHTML = 'Password matched';
    registerButton.disabled = false;
  } else {
    _('error-register').style.cssText = 'display:block;color:red';
    _('error-register').innerHTML = 'Password not matching';
    registerButton.disabled = true;
  }
};

_('register-password-confirmation').addEventListener('keyup', checkPassword);
_('register-password').addEventListener('keyup', checkPassword);
