/* eslint-disable arrow-parens */
import fetchUrl from '../utils/fetch-ressources.mjs';

const _ = (id) => document.getElementById(id);
const logoutBtn = _('logout-btn');
const getOrders = async () => {
  const user = await localStorage.getItem('user');
  const token = await localStorage.getItem('token');
  const url = `/api/v1/users/${user.id}/parcels`;

  fetchUrl(url, 'GET', undefined, token)
    .then(async (data) => {
      if (!data.orders.length) {
        _('my-orders-tbl').style.display = 'none';
      } else {
        data.orders.forEach((order) => {
          _('my-orders-tbl-body').innerHTML += ` <tr data-id=${order.id}>
        <td data-label="Order Id">${order.id}</td>
        <td data-label="Date">${order.orderdate.split('T')[0]}</td>
        <td data-label="Price">${order.price || '0'}</td>
        <td data-label="Origin"> ${order.origin} </td>
        <td data-label="Location"> ${order.presentlocation ||
          order.origin} </td>
        <td data-label="Destination"> ${order.destination}</td>
        <td data-label="Tracking"> ${order.trackingnumber || '...'}</td>
        <td data-label="Status"> ${order.status || '...'} </td>
        <td data-label="Action"><a class="edit-order">Edit</a> <a class="delete-order">Cancel</a> </td>
      </tr>`;
        });
      }
    })
    .catch((data) => {
      console.log(data);
    });
};

const logout = async () => {
  await localStorage.removeItem('token');
  await localStorage.removeItem('user');
};

logoutBtn.addEventListener('click', logout);
document.addEventListener('DOMContentLoaded', getOrders());
