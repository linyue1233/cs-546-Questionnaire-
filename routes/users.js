const express = require("express");
const router = express.Router();
const users = require("../data/users");
const validator = require("../helpers/routeValidators/userValidator");

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
    res.status(400).render("users/get_specific_user", { error: "Something went wrong." });
    return;
  } catch (e) {
    res.status(400).render("users/get_specific_user", { error: e });
    return;
  }
});

// create a new user
router.post("/", async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.password || !req.body.emailAddress || !req.body.displayName) {
    res.render("users/create_user", { error: "Please provide all information." });
    return;
  }
  let { firstName, lastName, password, emailAddress, displayName, avatarPath } = req.body;
  let passwordValid = validator.validatePassword(password);
  let emailValid = validator.validateEmailAddress(emailAddress);
  if (!passwordValid || !emailValid) {
    res.render("users/create_user", { error: "Please provide valid information." });
    return;
  }
  if (avatarPath === undefined) {
    avatarPath = "public/images/defaultAvatar.jpg";
  }
  if (firstName.length === 0 || firstName.trim().length === 0
    || lastName.length === 0 || lastName.trim().length === 0
    || password.length === 0 || password.trim().length === 0
    || emailAddress.length === 0 || emailAddress.trim().length === 0
    || displayName.length === 0 || displayName.trim().length === 0
    || avatarPath.length === 0 || avatarPath.trim().length === 0) {
    res.render("users/create_user", { error: "Please provide valid information." });
    return;
  }
  try{
    const addUser = await users.userSignUp(firstName,lastName,displayName,password,emailAddress,avatarPath);
    if(addUser.userInserted){
      res.redirect("/site/login");
      return;
    }
    res.status(400).render("users/create_user", { error: "Something went wrong." });
  }catch(e){
    res.status(400).render("users/create_user", { error: e});
    return;
  }
});


module.exports = router;
