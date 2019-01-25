/* eslint-disable import/extensions */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable arrow-parens */
import fetchUrl from '../utils/fetch-ressources.mjs';
import { getById, formTOJson } from '../utils/utils-functions.mjs';

const editOrderLocationModal = getById('edit-order-location-modal');
const editOrderStatusModal = getById('edit-order-status');

const changeLocationOrder = async (event) => {
  const user = await localStorage.getItem('user');
  const token = await localStorage.getItem('token');
  const row = event.target.closest('tr');
  const id = row.cells[0].innerHTML;
  const status = row.cells[7].innerHTML;
  const changeLocationButton = getById('edit-order-location-button');
  const changeLocationForm = getById('edit-order-location-form');
  if (Array.of('delivered', 'canceled').includes(status)) {
    alert('You cannot change  the destination of this order');
  } else if (
    confirm('Are you sure you want to change the location of this order?')
  ) {
    console.log(editOrderLocationModal);
    editOrderLocationModal.style.display = 'block';
    changeLocationButton.onclick = async (e) => {
      if (changeLocationForm.checkValidity()) {
        e.preventDefault();
        if (user && token) {
          const url = `/api/v1/parcels/${id}/presentLocation`;
          const data = formTOJson(changeLocationForm);
          console.log(data, '=======');
          fetchUrl(url, 'PUT', data, token)
            .then(async (successData) => {
              editOrderStatusModal.style.display = 'none';
              const errorDisplay = getById('order-notif');
              errorDisplay.innerHTML = successData.message;
              errorDisplay.style.cssText = 'padding: 1em;border-top: 0';
              errorDisplay.classList.add('isa_success');
            })
            .catch((errorData) => {
              editOrderStatusModal.style.display = 'none';
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

const changeStatus = async (event) => {
  const changeStatusButton = getById('edit-order-status-button');
  const changeStatusForm = getById('edit-order-status-form');
  const user = await localStorage.getItem('user');
  const token = await localStorage.getItem('token');
  const row = event.target.closest('tr');
  const id = row.cells[0].innerHTML;
  const status = row.cells[9].innerHTML;
  if (Array.of('delivered', 'canceled').includes(status)) {
    alert('You cannot change  the destination of this order');
  } else if (
    confirm('Are you sure you want to change the status of this order?')
  ) {
    const weightInput = getById('edit-order-weight-input');
    weightInput.style.display = 'none';
    if (status.includes('created')) {
      weightInput.style.display = 'block';
    }
    editOrderStatusModal.style.display = 'block';
    changeStatusButton.onclick = async (e) => {
      if (changeStatusForm.checkValidity()) {
        e.preventDefault();

        if (user && token) {
          const url = `/api/v1/parcels/${id}/status`;
          const data = formTOJson(changeStatusForm);
          console.log(data, '=======');
          fetchUrl(url, 'PUT', data, token)
            .then(async (successData) => {
              editOrderStatusModal.style.display = 'none';
              const errorDisplay = getById('order-notif');
              errorDisplay.innerHTML = successData.message;
              errorDisplay.style.cssText = 'padding: 1em;border-top: 0';
              errorDisplay.classList.add('isa_success');
            })
            .catch((errorData) => {
              editOrderStatusModal.style.display = 'none';
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
  const span = document.getElementsByClassName('close');

  // When the user clicks the button, open the modal

  // When the user clicks on <span> (x), close the modal

  Array.from(span, (el) =>
    el.addEventListener('click', () => {
      editOrderLocationModal.style.display = 'none';
      editOrderStatusModal.style.display = 'none';
    }),
  );

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = (event) => {
    if (
      event.target === editOrderLocationModal ||
      event.target === editOrderStatusModal
    ) {
      editOrderLocationModal.style.display = 'none';
      editOrderStatusModal.style.display = 'none';
    }
  };
  const allLocationButtons = document.getElementsByClassName(
    'edit-order-location',
  );
  Array.from(allLocationButtons, (el) =>
    el.addEventListener('click', changeLocationOrder),
  );

  const allChangeStatusButtons = document.getElementsByClassName(
    'edit-order-status',
  );
  Array.from(allChangeStatusButtons, (el) =>
    el.addEventListener('click', changeStatus),
  );
};
