window.onload = function() {
// Get the modal for the modal
const modal = document.getElementById('new-order');



// Get the button that opens the modal
const btn = document.getElementById("button-new-order");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
    let modalTitle = document.getElementById('new-order-form-title');
    modalTitle.innerHTML = "Create a new delivery order";
    // reset evrything in the form
    theForm = document.getElementById("new-order-form");
    theForm.reset()

    // renable the origin and destination
    let originInput = document.getElementById('new-order-input-origin');
    let destinationInput = document.getElementById('new-order-input-destination');
    originInput.disabled = false;
    destinationInput.disabled = false;
    submitButton.disabled = false;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
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
    modal.style.display = "block";
    // change the form name to edit
    let modalTitle = document.getElementById('new-order-form-title');
    let submitButton = document.getElementById('new-order-button');
    submitButton.disabled = false;
    modalTitle.innerHTML = 'Edit Order ' + orderId;
    // change the button to submit
    // put name in the field
    let originInput = document.getElementById('new-order-input-origin');
    originInput.value = origin;
    originInput.disabled = true;
    // disable destination if the status is delivered
    console.log(status);
    let destinationInput = document.getElementById('new-order-input-destination');
    destinationInput.disabled = false;

    if (status === 'delivered'){
        console.log('delivered')
        destinationInput.value = 'cannot change the destination';
        destinationInput.disabled = true;
        submitButton.disabled = true;
    }
    else{
        destinationInput.value = destination;
    }
};


const deleteOrder = function(){
    const row = this.closest('tr');
    const status = row.cells[6].innerHTML;
    if (status === 'delivered'){
        alert('cannot delete this order');
    }
    else{
        if (confirm('Are you sure you want to cancel this order')) {
            console.log('accepted');
            // do the action delete
        } else {
            console.log('declined');
            // Do nothing!
        }
    }
};

const allEditButtons = document.getElementsByClassName("edit-order");

// when a user click on any edit button fire an event
Array.from(allEditButtons, c => 
c.addEventListener('click', editOrder));

// delete an order  
const allDeleteButtons = document.getElementsByClassName("delete-order");
Array.from(allDeleteButtons, d => 
d.addEventListener('click', deleteOrder));
};


    /*
will look at it after
const disableEditDelete = function(Arow){
    // diable all input in  a sell where status is delivered
    const status = Arow.cells[5].innerHTML;
    const allEditButtons = document.getElementsByClassName("edit-order");
    const allDeleteButtons = document.getElementsByClassName("delete-order");
    if (status === 'delivered'){
        allEditButtons.forEach(edit => edit.style.display = "none");
    }

}
 */