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
      $(".card-body")
        .prepend(`<div class="alert alert-warning alert-dismissible fade show" role="alert">You've to be logged in first. <strong><a href="/site/login">Click here</a></strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>`);
      // alert("You've to be logged in first. You will be redirected to the login page now!");

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
      $(".card-body")
        .prepend(`<div class="alert alert-warning alert-dismissible fade show" role="alert">You've to be logged in first. 
        <strong><a href="/site/login">Click here</a></strong> to be redirected to the login page!
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>`);
      return;
    }
  );
});

$(".add-ans").click((event) => {
  let answerContent = $(".ck-content").text();
  if (answerContent.length === 0 || answerContent.trim().length === 0) {
    event.preventDefault();
    $("#textSubmit")
      .prepend(`<div class="alert alert-warning alert-dismissible fade show" role="alert">Someone once said
    <strong>'No answer is also an answer'</strong>! But here, it is recommended that you add some content first :)
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>`);
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
