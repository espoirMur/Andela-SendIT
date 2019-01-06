window.onload = () => {
  // edit order function should come here
  const editOrder = function() {
    // get the closest row for an element
    const row = this.closest('tr');
    // get details for that row
    const orderId = row.cells[0].innerHTML;
    const origin = row.cells[3].innerHTML;
    const destination = row.cells[4].innerHTML;
    const status = row.cells[6].innerHTML;
    // showing the modal
    modal.style.display = 'block';
    // change the form name to edit
    let modalTitle = document.getElementById('new-order-form-title');
    let submitButton = document.getElementById('new-order-button');
    let recipientPhone = document.getElementById('new-order-recipientPhone');
    let recipientPhoneLabel = document.getElementById('recipientPhone-label');
    recipientPhone.style.display = 'none';
    recipientPhoneLabel.style.display = 'none';

    submitButton.disabled = false;
    modalTitle.innerHTML = '';
    modalTitle.innerHTML = 'Edit Order ' + orderId;
    // change the button to submit
    // put name in the field
    let originInput = document.getElementById('new-order-input-origin');
    originInput.value = origin;
    originInput.disabled = true;
    // disable destination if the status is delivered
    console.log(status);
    let destinationInput = document.getElementById(
      'new-order-input-destination',
    );
    destinationInput.disabled = false;

    if (status === 'delivered') {
      console.log('delivered');
      destinationInput.value = 'cannot change the destination';
      destinationInput.disabled = true;
      submitButton.disabled = true;
    } else {
      destinationInput.value = destination;
    }
  };

  const allEditButtons = document.getElementsByClassName('edit-order');

  // when a user click on any edit button fire an event
  Array.from(allEditButtons, (c) => c.addEventListener('click', editOrder));

  // delete an order
};
