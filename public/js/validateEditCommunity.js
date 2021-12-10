const editCommunityForm = $("#editcom-form");

const validateStrings = (...strs) => {
  for (const str of strs) {
    if (!str) return false;
    if (typeof str !== "string") return false;
    if (str.length === 0 || str.trim().length === 0) return false;
  }
  return true;
};

const validateAlphanumeric = (str) => {
  const regex = new RegExp("^[a-zA-Z0-9_]*$");
  if (!regex.test(str)) return false;
};

editCommunityForm.submit((event) => {
  let title = $(`[name='title']`).val();
  let desc = $(`[name='description']`).val();
  let admin = $(`[name='administrator']`).val();
  let validate = validateStrings(title, desc, admin);
  let validAdmin = validateAlphanumeric(admin);
  if (!validate && !validAdmin) {
    event.preventDefault();
    let errorHtml = `<div class="alert alert-warning alert-dismissible fade show" role="alert">You should check in on some of those inputted fields. Only alphanumeric content and underscores allowed.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
    editCommunityForm.prepend(errorHtml);
  }
});
