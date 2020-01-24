import fetchUrl from '../utils/fetch-ressources.mjs';
import { getById, formTOJson } from '../utils/utils-functions.mjs';

const newOrderBtn = getById('new-order-button');
const newOrderForm = getById('new-order-form');
const modal = getById('new-order');
const createOrders = async (event) => {
  if (newOrderForm.checkValidity()) {
    event.preventDefault();
    const user = await localStorage.getItem('user');
    const token = await localStorage.getItem('token');
    if (user && token) {
      const url = '/api/v1/parcels';
      const data = formTOJson(newOrderForm);
      fetchUrl(url, 'POST', data, token)
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

const displayModal = () => {
  // Get the modal for the modal

  // Get the button that opens the modal
  const btn = getById('button-new-order');

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0];

  // When the user clicks the button, open the modal
  btn.onclick = () => {
    modal.style.display = 'table';
    const modalTitle = getById('new-order-form-title');
    modalTitle.innerHTML = 'Create a new delivery order';
    // reset evrything in the form
    newOrderForm.reset();

    // renable the origin and destination
    const originInput = getById('new-order-input-origin');
    const destinationInput = getById('new-order-input-destination');
    const submitButton = getById('new-order-button');
    originInput.disabled = false;
    destinationInput.disabled = false;
    submitButton.disabled = false;
  };

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
};
newOrderBtn.addEventListener('click', createOrders);
window.onload = displayModal();
