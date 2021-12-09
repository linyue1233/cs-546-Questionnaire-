const upvoteElement = $(".upvote");
const downvoteElement = $(".downvote");

upvoteElement.click((event) => {
  event.preventDefault();
  let requestConfig = {
    method: "POST",
    url: upvoteElement.attr("data-id"),
  };
  $.ajax(requestConfig).then(
    (response) => {
      // if (response.success) {
      //          console.log(response)
      $(".votecounter").text(response.upvotes.length);
      // }
    },
    (reason) => {
      window.location.href = "/site/login?errorCode=upvoteLogin";
      return;
    }
  );
});
