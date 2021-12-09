const express = require("express");
const router = express.Router();
const users = require("../data/users");
const questions = require("../data/questions");
const answers = require("../data/answers");
const communities = require("../data/communities");
const validator = require("../helpers/routeValidators/userValidator");

const path = require("path");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/userprofile"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("profileImage");

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
    res.status(400).render("users/get_specific_user", { error: "Something went wrong." });
    return;
  }
});

router.get("/:id/edit", async (req, res) => {
  if (req.session.userId) {
    let userId = req.params.id;
    const User = await users.listUser(userId);
    res.status(200).render("users/Update_userForm", { User: User, session: req.session });
  } else {
    res.redirect("/site/login");
  }
});
router.put("/:id", upload, async (req, res, next) => {
  // we get file name through multer req object : req.file.filename
  if (req.session.userId) {
    try {
      let userId = req.params.id;
      let firstName = req.body.firstName;
      let lastName = req.body.lastName;
      const User = await users.listUser(userId);
      let profImage = User.profileImage;
      let profileImage;
      if (req.file) {
        profileImage = req.file.filename;
      } else {
        profileImage = profImage;
      }
      if (
        typeof userId !== "string" ||
        typeof firstName !== "string" ||
        typeof lastName !== "string" ||
        typeof profileImage !== "string"
      ) {
        throw " not a valid inputs";
      }
      if (userId.trim() === "" || firstName.trim() === "" || lastName.trim() === "" || profileImage.trim() === "") {
        throw " not a valid inputs";
      }
      const updateUser = await users.updateUser(userId, firstName, lastName, profileImage);
      res.redirect(`/users/${userId}`);
      if (profileImage != profImage) {
        const pat = path.join(__dirname, `../public/images/userprofile/${profImage}`);
        fs.unlink(pat, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //old image removed from public/images/userprofile
        });
      }
      return;
    } catch (e) {
      const User = await users.listUser(req.params.id);
      User.error = e;
      res.status(400).render("users/Update_userForm", User);
      return;
    }
  } else {
    res.redirect("/site/login");
  }
});

router.get("/signup", async (req, res) => {
  if (!req.session.userId) {
    res.status(200).render("users/create_user");
    return;
  } else {
    res.redirect("/questions/all");
  }
});

router.get("/signup", async (req, res) => {
  if (!req.session.userId) {
    res.status(200).render("users/create_user");
    return;
  } else {
    res.redirect("/questions/all");
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
    let subscribedCommunities = [];
    for (let x of user.subscribedCommunities) {
      let reqCommunity = await communities.getCommunityById(x);
      subscribedCommunities.push({ _id: reqCommunity.community._id, name: reqCommunity.community.name });
    }
    let adminCommunities = [];
    for (let x of user.adminCommunities) {
      let reqCommunity = await communities.getCommunityById(x);
      adminCommunities.push({ _id: reqCommunity.community._id, name: reqCommunity.community.name });
    }
    const answeredQuestions = await answers.getAnswerByUserId(userId);
    const postedQuestions = await questions.getAllByUserId(userId);
    res.render("users/get_specific_user", {
      user: user,
      session: req.session,
      subscribedCommunities: subscribedCommunities,
      adminCommunities: adminCommunities,
      answeredQuestions: answeredQuestions,
      postedQuestions: postedQuestions,
    });
    return;
  } catch (e) {
    res.status(400).render("users/get_specific_user", { error: e, session: req.session });
  }
});

// create a new user
router.post("/", upload, async (req, res) => {
  console.log(1111);
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.password ||
    !req.body.emailAddress ||
    !req.body.displayName
  ) {
    console.log(req.body.firstName);
    console.log(req.body.displayName);
    res.render("users/create_user", { error: "Please provide all information.", body: req.body });
    return;
  }
  console.log(req.body);
  let { firstName, lastName, password, emailAddress, displayName } = req.body;
  let passwordValid = validator.validatePassword(password);
  let emailValid = validator.validateEmailAddress(emailAddress);
  if (!passwordValid.isValid || !emailValid.isValid) {
    res.render("users/create_user", { error: "Please provide valid information.", body: req.body });
    return;
  }
  let profileImage;
  if (!req.file) {
    profileImage = "defaultAvatar.jpg";
  } else {
    profileImage = req.file.filename;
  }
  console.log(profileImage);
  if (
    firstName.length === 0 ||
    firstName.trim().length === 0 ||
    lastName.length === 0 ||
    lastName.trim().length === 0 ||
    password.length === 0 ||
    password.trim().length === 0 ||
    emailAddress.length === 0 ||
    emailAddress.trim().length === 0 ||
    displayName.length === 0 ||
    displayName.trim().length === 0 ||
    profileImage.length === 0 ||
    profileImage.trim().length === 0
  ) {
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
    res.status(400).render("users/create_user", { error: e, body: req.body });
    return;
  }
});

module.exports = router;
