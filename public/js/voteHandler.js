const upvoteElement = $(".upvote");
const downvoteElement = $(".downvote");

upvoteElement.click((event) => {
  event.preventDefault();
  let requestConfig = {
    method: "POST",
    url: upvoteElement.attr("data-id"),
  };
  console.log(requestConfig);
  $.ajax(requestConfig).then(
    (response) => {
      $(".votecounter").text(response.count);
      $(".upvote").toggleClass("fas");
    },
    (reason) => {
      window.location.href = "/site/login?errorCode=upvoteLogin";
      return;
    }
  );
});

downvoteElement.click((event) => {
  event.preventDefault();
  let requestConfig = {
    method: "POST",
    url: downvoteElement.attr("data-id"),
  };
  console.log(requestConfig);
  $.ajax(requestConfig).then(
    (response) => {
      // if (response.success) {
      //          console.log(response)
      $(".votecounter").text(response.count);
      $(".downvote").toggleClass("fas");
      // }
    },
    (reason) => {
      window.location.href = "/site/login?errorCode=downvoteLogin";
      return;
    }
  );
});
