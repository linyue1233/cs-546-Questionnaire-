let button = document.querySelector('#b');
let title = document.querySelector('#title');
let description = document.querySelector('#description');
let tags = document.querySelector('#tags');

button.addEventListener('click', function (event) {
  if (
    isNaN(title.value) === false ||
    isNaN(description.value) === false ||
    isNaN(tags.value) === false
  ) {
    event.preventDefault();
    alert('Invalid Inputs! Input can not be a number');
  }
});
