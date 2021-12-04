const express = require("express");
const router = express.Router();
const users = require("../data/users");
const validator = require("../helpers/routeValidators/userValidator");

const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/userprofile'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  },
})

let upload = multer({
  storage: storage,
}).single('profileImage');

router.delete("/:id", async (req, res) => {
  let userId = req.params.id;
  let validate = validator.validateId(userId);
  if (!validate.isValid) {
    res.render("users/get_specific_user", { error: validate.message });
    return;
  }
  try {
    const deletedUser = await users.deleteUser(userId);
    if (deletedUser.deleted) {
      // Maybe throw a success prompt, but delete the user and log them out
      // for now, redirecting to questions
      // TODO: revisit with logout code
      res.redirect("/questions/all");
      return;
    }
    res
      .status(400)
      .render("users/get_specific_user", { error: "Something went wrong." });
    return;
  } catch (e) {
    res.status(400).render("users/get_specific_user", { error: e });
    return;
  }
});

router.get("/:id", async (req, res) => {
  let userId = req.params.id;
  if (userId != req.session.userId) res.redirect("/site/login");
  let validate = validator.validateId(userId);
  if (!validate.isValid) {
    res.render("users/get_specific_user", {
      error: validate.message,
      session: req.session,
    });
    return;
  }
  try {
    const user = await users.listUser(userId);
    console.log(user);
    res.render("users/get_specific_user", { user: user, session: req.session });
    return;
  } catch (e) {
    res
      .status(400)
      .render("users/get_specific_user", { error: e, session: req.session });
  }
});

router.get("/signup", async (req, res) => {
  if (!req.session.userId) {
    res.status(200).render('users/create_user');
    return;
  } else {
    res.redirect('/questions/all');
  }
})

// create a new user
router.post("/", upload, async (req, res) => {
  console.log(1111);
  if (!req.body.firstName || !req.body.lastName || !req.body.password || !req.body.emailAddress || !req.body.displayName) {
    console.log(req.body.firstName);
    console.log(req.body.displayName);
    res.render("users/create_user", { error: "Please provide all information." });
    return;
  }
  console.log(req.body);
  let { firstName, lastName, password, emailAddress, displayName } = req.body;
  let passwordValid = validator.validatePassword(password);
  let emailValid = validator.validateEmailAddress(emailAddress);
  if (!passwordValid.isValid || !emailValid.isValid) {
    res.render("users/create_user", { error: "Please provide valid information." });
    return;
  }
  let profileImage;
  if (!req.file) {
    profileImage = "public/images/userprofile/defaultAvatar.jpg";
  } else {
    profileImage = req.file.filename;
  }
  console.log(profileImage);
  if (firstName.length === 0 || firstName.trim().length === 0
    || lastName.length === 0 || lastName.trim().length === 0
    || password.length === 0 || password.trim().length === 0
    || emailAddress.length === 0 || emailAddress.trim().length === 0
    || displayName.length === 0 || displayName.trim().length === 0
    || profileImage.length === 0 || profileImage.trim().length === 0) {
    res.render("users/create_user", { error: "Please provide valid information." });
    return;
  }
  try {
    const addUser = await users.userSignUp(firstName, lastName, displayName, password, emailAddress, profileImage);
    if (addUser.userInserted) {
      const filePath = path.join(__dirname, `../public/images/userprofile/${profileImage}`);
      res.redirect("/site/login");
      return;
    }
    res.status(400).render("users/create_user", { error: "Something went wrong." });
  } catch (e) {
    res.status(400).render("users/create_user", { error: e });
    return;
  }
});

module.exports = router;
