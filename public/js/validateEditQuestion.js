const editQuesForm = $("#edit-ques");

const prependWarning = (elem) => {
  elem.prepend(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Attention!</strong> You should check in on some of those fields below.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`);
};

editQuesForm.submit((event) => {
  let desc = $("#description").val();
  let title = $("#title").val();
  let tags = $("#tags").val();
  let community = $("#community").val();

  if (!desc || !title || !tags || !community) {
    event.preventDefault();
    prependWarning($(event.target));
  }
  if (desc.length === 0 || desc.trim().length === 0) {
    event.preventDefault();
    prependWarning($(event.target));
  }
  if (title.length === 0 || title.trim().length === 0) {
    event.preventDefault();
    prependWarning($(event.target));
  }
  if (tags.length === 0 || tags.trim().length === 0) {
    event.preventDefault();
    prependWarning($(event.target));
  }
  if (community.length === 0 || community.trim().length === 0) {
    event.preventDefault();
    prependWarning($(event.target));
  }
});
