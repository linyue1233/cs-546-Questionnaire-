const userSignupForm = $("#signup-form");

const validateStrings = (...strs) => {
  for (const str of strs) {
    if (!str) return false;
    if (typeof str !== "string") return false;
    if (str.length === 0 || str.trim().length === 0) return false;
    const regex = new RegExp("^[a-zA-Z0-9_]*$");
    if (!regex.test(str)) return false;
  }
  return true;
};

const validateFile = (filePath) => {
  if (filePath.trim().length === 0) return false;
  if (filePath.indexOf(".") === -1) return false;
  let acceptedFileExtensions = ["jpg", "jpeg", "bmp", "gif", "png"];
  let split = filePath.split(".");
  let extension = split[split.length - 1];
  if (!acceptedFileExtensions.includes(extension)) return false;
};

userSignupForm.submit((event) => {
  let firstName = $("#firstName").val();
  let lastName = $("#lastName").val();
  let password = $("#password").val();
  let email = $("#emailAddress").val();
  let displayName = $("#displayName").val();
  let file = $('[type="file"]').val();
  let isFileAdded = String.valueOf(file).length === 1 ? false : true;
  let validate = validateStrings(firstName, lastName, password, email, displayName);
  let validateFile = true;
  if (isFileAdded) {
    validateFile = validateFile(file);
  }
  if (!validate) {
    event.preventDefault();
    let errorHtml = `<div class="alert alert-warning alert-dismissible fade show" role="alert">You should check in on some of those inputted fields.
                        <br>Accepted formats for user avatars are "jpg", "jpeg", "bmp", "gif", "png".
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
    userSignupForm.prepend(errorHtml);
    return;
  }
  if (!validateFile) {
    event.preventDefault();
    let errorHtml = `<div class="alert alert-warning alert-dismissible fade show" role="alert">You should check in on some of those inputted fields.
                        <br>Accepted formats for user avatars are "jpg", "jpeg", "bmp", "gif", "png".
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
    userSignupForm.prepend(errorHtml);
    return;
  }
});
