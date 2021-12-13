const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: "questionnaire_assist@outlook.com",
    pass: "Fduser@123",
  },
});

const sendPasswordResetEmail = async (toEmail, nameToAddress, persistenceToken) => {
  let message = {
    from: "questionnaire_assist@outlook.com",
    to: toEmail,
    subject: "Forgot Password Request for Questionnaire",
    html: `<body style="font-family: menlo; color: #00004d">
    <center>
    <h1>Hey ${nameToAddress}! Your password reset link is here! </h1>
    <hr>
  We received a request from your end for resetting your password.
          If you did trigger this email, you can go to this <a target="_blank" href="http://localhost:3000/site/forgot_password/${persistenceToken}/edit">link</a> to reset your password. 
          In case this was not done by you, you can safely ignore this email. 
          <br> We @Questionnaire wish you a great day!
      <br>
      <br>
      <p>P.S: This is the link: <a href="http://localhost:3000/site/forgot_password/${persistenceToken}/edit">http://localhost:3000/site/forgot_password/${persistenceToken}/edit</a> - if you're having trouble, just copy-paste it into the URL of your browser.
      Also, this link is meant for your hands only - <strong>DO NOT</strong> share it with anyone.
  </body>`,
  };

  transporter.sendMail(message).then(
    (success) => {
      console.log("Forgot Password mail sent successfully!");
    },
    (failure) => {
      console.log("Forgot Password mail couldn't be sent!");
    }
  );
};

module.exports = {
  sendPasswordResetEmail,
};
