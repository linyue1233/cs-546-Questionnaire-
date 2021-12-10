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
      $(".votecounter").text(response.count);
      $(".upvote").toggleClass("fas");
    },
    (reason) => {
      alert("You've to be logged in first. You will be redirected to the login page now!");
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
      alert("You've to be logged in first. You will be redirected to the login page now!");
      window.location.href = "/site/login?errorCode=downvoteLogin";
      return;
    }
  );
});

$(".add-ans").click((event) => {
  let answerContent = $(".ck-content").text();
  if (answerContent.length === 0 || answerContent.trim().length === 0) {
    event.preventDefault();
    document.getElementById("ans-err").text = "Add some text before submitting your answer.";
    $("#ans-err").toggleClass("show");
  }
});

$("#reportQuestion").click((event) => {
  event.preventDefault();
  let requestConfig = {
    method: "POST",
    url: $("#reportQuestion").attr("data-id"),
  };
  console.log(requestConfig);
  $.ajax(requestConfig).then(
    (response) => {
      alert(response.message);
    },
    (reason) => {
      alert(response.message);
    }
  );
});
