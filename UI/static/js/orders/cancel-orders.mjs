/* eslint-disable arrow-parens */
import fetchUrl from '../utils/fetch-ressources.mjs';
import { getById, formTOJson } from '../utils/utils-functions.mjs';

const cancelOrder = async () => {
  const user = await localStorage.getItem('user');
  const token = await localStorage.getItem('token');
  const row = this.closest('tr');
  const id = row.cells[0].innerHTML;
  const status = row.cells[6].innerHTML;
  if (status === 'delivered') {
    alert('cannot delete this order');
  } else if (confirm('Are you sure you want to cancel this order')) {
    console.log('accepted');
    // do the action delete
  } else {
    console.log('declined');
    // Do nothing!
  }
  if (user && token) {
    const url = `/api/v1/parcels/${id}/cancel`;
    fetchUrl(url, 'PUT', undefined, token)
      .then(async (data) => {
        const errorDisplay = getById('order-notif');
        errorDisplay.innerHTML = data.message;
        errorDisplay.style.cssText = 'padding: 1em;border-top: 0';
        errorDisplay.classList.add('isa_success');
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

const allCancelButtons = document.getElementsByClassName('cancel-order');
console.log(Array.from(allCancelButtons));
allCancelButtons.addEventListener('click', cancelOrder);
