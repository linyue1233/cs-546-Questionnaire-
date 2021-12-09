let qcc = $("#toggle-qcreate-comm");
let createButton = $("#create-comm-btn");
const communityCreateUrl = "/communities/quickCreate";

const validateStrings = (str) => {
  if (!str) throw "Invalid entry, please pass in valid content";
  if (typeof str !== "string") throw "Invalid entry, please pass in valid content";
  if (str.length === 0 || str.trim().length === 0) throw "Invalid entry, please pass in valid content";
};

createButton.click((event) => {
  event.preventDefault();
  let communityName = "";
  let communityDesc = "";
  try {
    communityName = $("#qc-name").val();
    validateStrings(communityName);
    communityDesc = $("#qc-desc").val();
    validateStrings(communityDesc);
  } catch (e) {
    //$(".showComError").show();

    document.getElementById("showQcErr").hidden = false;
    return;
  }
  let requestConfig = {
    method: "POST",
    url: communityCreateUrl,
    data: {
      name: communityName,
      description: communityDesc,
    },
  };
  $.ajax(requestConfig).then((message) => {
    if (!message.success) {
      document.getElementById("showQcErr").innerText = "Can't quick create community - something went wrong.";
      document.getElementById("showQcErr").hidden = false;
    }
    location.reload();
  });
});

qcc.click((event) => {
  let toggle = document.getElementById("comm-qcreate");
  if (toggle.hidden) {
    toggle.hidden = false;
  } else {
    toggle.hidden = true;
  }
});
