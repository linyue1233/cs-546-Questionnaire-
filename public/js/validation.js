function validateSearchForm() {
  let term = document.forms["search_form"]["keyword"].value;
  if (term.trim().length == 0 || term.match(/^[^a-zA-Z0-9]+$/) != null) {
    alert("Invalid search term");
    return false;
  }
  return true;
}

function validateCommunity() {
  let community = document.forms["new_question"]["community"].value;
  if (community == "") {
    alert("Please select a community");
    return false;
  }
  return true;
}

function validateAdmin() {
  let community = document.forms["com_edit_form"]["administrator"].value;
  if (community == "") {
    alert("Please select an administrator");
    return false;
  }
  return true;
}
