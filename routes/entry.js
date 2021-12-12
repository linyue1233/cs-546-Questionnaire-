const express = require("express");
const router = express.Router();
const users = require("../data/users");
const validator = require("../helpers/routeValidators/userValidator");
const xss = require("xss");
const email = require("../data/email");
router.get("/login", async (req, res) => {
  // if existing session is valid, redirect to home
  if (xss(req.session.userId)) {
    res.redirect("/");
    return;
  }
  // show login form
  res.status(200).render("entry_pages/login", { session: req.session });
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
      session: req.session,
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
      session: req.session,
    });
    return;
  } catch (e) {
    res.status(400).render("entry_pages/login", {
      error: "Invalid email address or password combination.",
      session: req.session,
    });
    return;
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
  return;
});

router.get("/forgot_password", async (req, res) => {
  if (req.session.userId) {
    res.redirect("/site/login");
    return;
  }
  res.status(200).render("entry_pages/forgot_password");
  return;
});

router.post("/requestPasswordReset", async (req, res) => {
  try {
    if (req.session.userId) {
      res.redirect("/site/login");
      return;
    }
    let emailAddress = xss(req.body.email);
    if (!emailAddress) {
      res.status(400).render("entry_pages/forgot_password", { error: "Invalid email address." });
      return;
    }
    const userExists = await users.checkUserForPasswordReset(emailAddress);
    const triggerEmail = await email.sendPasswordResetEmail(emailAddress, userExists.name, userExists.token);
    res.status(200).render("entry_pages/forgot_password", {
      error: "We'll send you a password reset link to your email if we find it in our system.",
    });
  } catch (e) {
    res.status(200).render("entry_pages/forgot_password", {
      error: "We'll send you a password reset link to your email if we find it in our system.",
    });
    return;
  }
});

router.get("/forgot_password/:persistenceToken/edit", async (req, res) => {
  try {
    if (req.session.userId) {
      res.redirect("/site/login");
      return;
    }
    let pToken = req.params.persistenceToken;
    if (!pToken) {
      res.redirect("/site/login");
      return;
    }
    const findUser = await users.findUserByPersistenceToken(pToken);
    if (findUser) {
      res.status(200).render("entry_pages/accepted_password_reset", { user: findUser });
      return;
    }
    res.redirect("/site/login");
    return;
  } catch (e) {
    console.log(e);
    res.redirect("/site/login");
    return;
  }
});

router.post("/:persistenceToken/performPasswordReset", async (req, res) => {
  try {
    if (req.session.userId) {
      res.redirect("/site/login");
      return;
    }
    let password = xss(req.body.password);
    let validate = validator.validatePassword(password);
    if (!validate.isValid) {
      console.log(validate.message);
      res.redirect("site/login");
      return;
    }
    let pToken = req.params.persistenceToken;
    if (!pToken) {
      res.redirect("/site/login");
      return;
    }
    let performReset = await users.performPasswordReset(pToken, password);
    if (performReset) {
      res.render("entry_pages/accepted_password_reset", {
        error: "We've reset your password. Navigate to the login page and proceed logging in with the new password. ",
      });
      return;
    }
    res.status(400).render("entry_pages/accepted_password_reset", {
      error: "Sorry, but we can't reset your password.",
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(400).render("entry_pages/accepted_password_reset", {
      error: "Sorry, but we can't reset your password.",
    });
    return;
  }
});

module.exports = router;
