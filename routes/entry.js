const express = require("express");
const router = express.Router();
const users = require("../data/users");
const validator = require("../helpers/routeValidators/userValidator");
const xss = require("xss");
router.get("/login", async (req, res) => {
  // if existing session is valid, redirect to home
  if (xss(req.session.userId)) {
    res.redirect("/");
    return;
  }
  // show login form
  res.status(200).render("entry_pages/login", { session: xss(req.session) });
  return;
});

router.post("/login", async (req, res) => {
  let emailAddress = xss(req.body.email);
  let password = xss(req.body.password);
  const validateUsername = validator.validateEmailAddress(emailAddress);
  const validatePassword = validator.validatePassword(password);
  if (!validateUsername.isValid || !validatePassword.isValid) {
    res.status(400).render("entry_pages/login", {
      error: "Invalid email address or password combination.",
      session: xss(req.session),
    });
    return;
  }
  try {
    const userLogin = await users.checkUser(emailAddress, password);
    if (userLogin.authenticated) {
      // setting session variables for use later on.
      req.session.userEmail = userLogin.userEmail;
      req.session.userDispName = userLogin.userDispName;
      req.session.userId = userLogin.userId;
      res.redirect(`/users/${userLogin.userId}`);
      return;
    }
    // code is not supposed to reach here, but if it does, reload login page with error.
    res.status(400).render("entry_pages/login", {
      error: "Invalid email address or password combination.",
      session: xss(req.session),
    });
    return;
  } catch (e) {
    res.status(400).render("entry_pages/login", {
      error: "Invalid email address or password combination.",
      session: xss(req.session),
    });
    return;
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
  return;
});

module.exports = router;
