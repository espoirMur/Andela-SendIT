/* eslint-disable import/extensions */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable arrow-parens */
import fetchUrl from '../utils/fetch-ressources.mjs';
import { getById, formTOJson } from '../utils/utils-functions.mjs';

const modal = getById('edit-order-modal');
const cancelOrder = async (event) => {
  const user = await localStorage.getItem('user');
  const token = await localStorage.getItem('token');
  const row = event.target.closest('tr');
  const id = row.cells[0].innerHTML;
  const status = row.cells[7].innerHTML;
  console.log(
    '==============',
    status,
    Array.of('delivered', 'canceled'),
    Array.of('delivered', 'canceled').includes(status),
  );
  if (Array.of('delivered', 'canceled').includes(status.toString())) {
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
        const errorDisplay = getById('order-notif');
        errorDisplay.innerHTML = data.message;
        errorDisplay.style.cssText = 'padding: 1em;border-top: 0';
        errorDisplay.classList.add('isa_error');
      });
  } else {
    window.location = '/login.html';
  }
};

const editOrder = async (event) => {
  const editOrderButton = getById('edit-order-button');
  const editOrderForm = getById('edit-order-form');
  const user = await localStorage.getItem('user');
  const token = await localStorage.getItem('token');
  const row = event.target.closest('tr');
  const id = row.cells[0].innerHTML;
  const status = row.cells[7].innerHTML;
  if (Array.of('delivered', 'canceled').includes(status)) {
    alert('You cannot change  the destination of this order');
  } else if (
    confirm('Are you sure you want to change the destination of this order?')
  ) {
    modal.style.display = 'block';
    editOrderButton.onclick = async (e) => {
      if (editOrderForm.checkValidity()) {
        e.preventDefault();

        if (user && token) {
          const url = `/api/v1/parcels/${id}/destination`;
          const data = formTOJson(editOrderForm);
          fetchUrl(url, 'PUT', data, token)
            .then(async (successData) => {
              modal.style.display = 'none';
              const errorDisplay = getById('order-notif');
              errorDisplay.innerHTML = successData.message;
              errorDisplay.style.cssText = 'padding: 1em;border-top: 0';
              errorDisplay.classList.add('isa_success');
            })
            .catch((errorData) => {
              modal.style.display = 'none';
              const errorDisplay = getById('order-notif');
              errorDisplay.innerHTML = errorData.message;
              errorDisplay.style.cssText = 'padding: 1em;border-top: 0';
              errorDisplay.classList.add('isa_error');
            });
        } else {
          window.location = '/login.html';
        }
      }
    };
  } else {
    console.log('declined');
    // Do nothing!
  }
};

window.onload = () => {
  // Get the <span> element that closes the modal

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[1];

  // When the user clicks the button, open the modal

  // When the user clicks on <span> (x), close the modal
  span.onclick = () => {
    modal.style.display = 'none';
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
  const allCancelButtons = document.getElementsByClassName('cancel-order');
  Array.from(allCancelButtons, (el) =>
    el.addEventListener('click', cancelOrder),
  );
  const allEditButtons = document.getElementsByClassName('edit-order');
  Array.from(allEditButtons, (el) => el.addEventListener('click', editOrder));
};
