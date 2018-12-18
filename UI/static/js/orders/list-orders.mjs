/* eslint-disable arrow-parens */
import fetchUrl from '../utils/fetch-ressources.mjs';

const _ = (id) => document.getElementById(id);
const logoutBtn = _('logout-btn');
const getOrders = async () => {
  const user = await localStorage.getItem('user');
  const token = await localStorage.getItem('token');
  const url = `/api/v1/users/${user.id}/parcels`;

  fetchUrl(url, 'GET', undefined, token)
    .then(async (successData) => {
      console.log(successData);
    })
    .catch((errorData) => {
      console.log(errorData);
    });
};

const logout = async () => {
  await localStorage.removeItem('token');
  await localStorage.removeItem('user');
};

logoutBtn.addEventListener('click', logout);
document.addEventListener('DOMContentLoaded', getOrders());
