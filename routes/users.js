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
    return;
  }
});

module.exports = router;
