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
    text: `Hey ${nameToAddress}! We received a request from your end for resetting your password. 
        If you did trigger this email, you can go to this link to reset your password: http://localhost:3000/site/forgot_password/${persistenceToken}/edit. In case this was not done by you,
        you can ignore this email. Have a great one! :)`,
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
