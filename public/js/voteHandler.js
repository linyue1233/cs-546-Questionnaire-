const upvoteElement = $('.upvote');
const downvoteElement = $('.downvote');

upvoteElement.click((event) => {
  event.preventDefault();
  let requestConfig = {
      method: "POST",
      url: upvoteElement.attr('data-id')
  }  
  console.log(requestConfig);
  $.ajax(requestConfig).then((response) => {
      // if (response.success) {
          console.log(response)
          $('.votecounter').text(response.length);
      // }
  })
})