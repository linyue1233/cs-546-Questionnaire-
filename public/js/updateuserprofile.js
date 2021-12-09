let button = document.querySelector('#bu');
let firstname = document.querySelector('#firstName');
let lastname = document.querySelector('#lastName');

button.addEventListener('click', function (event) {
  if (
    firstname.value.trim() == '' ||
    lastname.value.trim() == '' ||
    isNaN(firstname.value) === false ||
    isNaN(lastname.value) === false
  ) {
    event.preventDefault();
    alert('Invalid Inputs! Please provide proper name');
  }
});
