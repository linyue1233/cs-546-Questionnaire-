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

function validate_com_form() {
  let community_name = document.forms["com_form"]["name"].value;
  let community_description = document.forms["com_form"]["description"].value;
  if (community_name.match(/^[a-zA-Z]/) == null || community_description.match(/^[a-zA-Z]/) == null) {
    alert("Please enter name and description starting with some text");
    return false;
  }
  return true;
}
