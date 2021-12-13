const upvoteElement = $(".upvote");
const downvoteElement = $(".downvote");
const answerUpvoteElem = $(".ans-up");
const answerDownvoteElem = $(".ans-down");

answerUpvoteElem.click((event) => {
  event.preventDefault();
  // console.log(event.target.dataset.id);
  let url = event.target.dataset.id;
  if (!url) return;
  let requestConfig = {
    method: "POST",
    url,
  };
  $.ajax(requestConfig).then(
    (message) => {
      $(event.target).next().text(message.count);
      if ($(event.target).hasClass("far")) {
        $(event.target).removeClass("far").addClass("fas");
      } else {
        $(event.target).removeClass("fas").addClass("far");
      }
    },
    (reason) => {
      if (reason.status === 401) {
        $(".card-body").first()
          .prepend(`<div class="alert alert-warning alert-dismissible fade show" role="alert">You've to be logged in first. 
        <strong><a href="/site/login">Click here</a></strong> to be redirected to the login page!
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>`);
      } else {
        $(".card-body").first()
          .prepend(`<div class="alert alert-warning alert-dismissible fade show" role="alert">Hmm, something is not right. This is the error we're seeing - ${reason.responseJSON.message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>`);
      }
    }
  );
});

answerDownvoteElem.click((event) => {
  event.preventDefault();
  // console.log(event.target.dataset.id);
  let url = event.target.dataset.id;
  if (!url) return;
  let requestConfig = {
    method: "POST",
    url,
  };
  $.ajax(requestConfig).then(
    (message) => {
      $(event.target).prev().text(message.count);
      if ($(event.target).hasClass("far")) {
        $(event.target).removeClass("far").addClass("fas");
      } else {
        $(event.target).removeClass("fas").addClass("far");
      }
    },
    (reason) => {
      console.log(reason);
      $(".card-body").first()
        .prepend(`<div class="alert alert-warning alert-dismissible fade show" role="alert">You've to be logged in first. 
        <strong><a href="/site/login">Click here</a></strong> to be redirected to the login page!
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>`);
    }
  );
});

upvoteElement.click((event) => {
  event.preventDefault();
  let requestConfig = {
    method: "POST",
    url: upvoteElement.attr("data-id"),
  };
  $.ajax(requestConfig).then(
    (response) => {
      $(".votecounter").text(response.count);
      if ($(".downvote").hasClass("fas")) {
        $(".downvote").removeClass("fas").addClass("far");
      }
      if ($(".upvote").hasClass("far")) {
        $(".upvote").removeClass("far").addClass("fas");
      } else {
        $(".upvote").removeClass("fas").addClass("far");
      }
    },
    (reason) => {
      $(".card-body").first()
        .prepend(`<div class="alert alert-warning alert-dismissible fade show" role="alert">You've to be logged in first. 
        <strong><a href="/site/login">Click here</a></strong> to be redirected to the login page!
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
      if ($(".upvote").hasClass("fas")) {
        $(".upvote").removeClass("fas").addClass("far");
      }
      if ($(".downvote").hasClass("far")) {
        $(".downvote").removeClass("far").addClass("fas");
      } else {
        $(".downvote").removeClass("fas").addClass("far");
      }
      // }
    },
    (reason) => {
      $(".card-body").first()
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

$("#add-ans").submit((event) => {
  let answerContent = $("#description").val();
  if (answerContent.length === 0 || answerContent.trim().length === 0) {
    event.preventDefault();
    $("#add-ans").prepend(`<div class="alert alert-warning alert-dismissible fade show" role="alert">Someone once said
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
      $(".card-body").first()
        .prepend(`<div class="alert alert-success alert-dismissible fade show" role="alert">${response.message}. The admin will look into this and will resolve accordingly.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>`);
      $(".qbtn-place").html(null);
      $(".qbtn-place").html(
        `<button class="btn btn-secondary" disabled id="reportQuestion">Flagged For Review</button>`
      );
    },
    (reason) => {
      $(".card-body").first()
        .prepend(`<div class="alert alert-success alert-dismissible fade show" role="alert">${response.message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>`);
    }
  );
});

$(".report-ans").click((event) => {
  event.preventDefault();
  let requestConfig = {
    method: "POST",
    url: event.target.dataset.id,
  };
  console.log(requestConfig);
  $.ajax(requestConfig).then(
    (response) => {
      $(event.target).parent().html(`<button class="btn btn-secondary btn-sm" disabled>Flagged For Review</button>`);
    },
    (reason) => {
      $(event.target).parent()
        .prepend(`<div class="alert alert-success alert-dismissible fade show" role="alert">Unable to report, please try again later!
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
      </button>
  </div>`);
    }
  );
});
