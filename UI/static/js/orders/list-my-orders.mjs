/* eslint-disable arrow-parens */
import fetchUrl from '../utils/fetch-ressources.mjs';

const _ = (id) => document.getElementById(id);
const logoutBtn = _('logout-btn');
const getOrders = async () => {
  const user = await localStorage.getItem('user');
  const token = await localStorage.getItem('token');
  if (user && token) {
    const url = `/api/v1/users/${user.id}/parcels`;
    fetchUrl(url, 'GET', undefined, token)
      .then(async (data) => {
        if (!data.orders.length) {
          _('my-orders-tbl').style.display = 'none';
        } else {
          let pending = 0;
          let canceled = 0;
          let delivered = 0;
          data.orders.forEach((order) => {
            // could be replace with reduce returning  a object with count for diffrents status
            switch (order.status) {
              case 'delivered':
                delivered += 1;
                break;
              case 'canceled':
                canceled += 1;
                break;
              default:
                pending += 1;
            }
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
        <td data-label="Action"><span class="cancel-order">Cancel</span> 
        <span class="edit-order">Edit</span>
      </tr>`;
          });
          _('delivered-display').innerHTML = `${delivered} Parcels`;
          _('canceled-display').innerHTML = `${canceled} Parcels`;
          _('pending-display').innerHTML = `${pending} Parcels`;
        }
      })
      .catch((data) => {
        const errorDisplay = _('order-notif');
        errorDisplay.innerHTML = data.message;
        errorDisplay.style.cssText = 'padding: 1em;border-top: 0';
        errorDisplay.classList.add('isa_error');
      });
  } else {
    window.location = '/login.html';
  }
};

const logout = async () => {
  await localStorage.removeItem('token');
  await localStorage.removeItem('user');
};

logoutBtn.addEventListener('click', logout);
document.addEventListener('DOMContentLoaded', getOrders());
