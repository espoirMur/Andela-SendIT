window.onload = function() {
  // Get the modal for the modal

  // edit order function should come here
  const editOrder = function() {
    // get the closest row for an element
    const row = this.closest('tr');
    // get details for that row
    const orderId = row.cells[0].innerHTML;
    const currentLocation = row.cells[7].innerHTML;
    const status = row.cells[9].innerHTML;
    // showing the modal
    modal.style.display = 'block';
    // change the form name to edit
    let modalTitle = document.getElementById('edit-order-form-title');
    let submitButton = document.getElementById('edit-order-button');
    submitButton.disabled = false;
    modalTitle.innerHTML = '';
    modalTitle.innerHTML = `Update delivery  ${orderId}`;
    // change the button to submit
    // put current location
    let currentLocationInput = document.getElementById(
      'order-input-current-location',
    );
    currentLocationInput.value = currentLocation;

    // disable destination if the status is delivered
    console.log(status);
    let statusInput = document.getElementById('order-input-status');
    statusInput.value = status;
  };

  const cancelOrder = function() {
    const row = this.closest('tr');
    const status = row.cells[6].innerHTML;
    if (status === 'delivered') {
      alert('cannot delete this order');
    } else {
      if (confirm('Are you sure you want to cancel this order')) {
        console.log('accepted');
        // do the action delete
      } else {
        console.log('declined');
        // Do nothing!
      }
    }
  };

  const allEditButtons = document.getElementsByClassName('edit-order');

  Array.from(allDeleteButtons, (d) => d.addEventListener('click', cancelOrder)); // when a user click on any edit button fire an event
  Array.from(allEditButtons, (c) => c.addEventListener('click', editOrder));

  const allDeleteButtons = document.getElementsByClassName('delete-order');
};
