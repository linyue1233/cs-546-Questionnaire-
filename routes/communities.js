const express = require("express");
const router = express.Router();
const community = require("../data/communities");
const communities = require("../data/communities");
const users = require("../data/users");
const questions = require("../data/questions");
const validator = require("../helpers/routeValidators/communityValidator");

router.get("/", async (req, res) => {
  try {
    let com = await community.getAllcommunities();
    res.render("communities/getAllcommunity", { com: com, session: req.session });
  } catch (e) {
    res.render("communities/getAllcommunity", { error: e, session: req.session });
  }
});

// Needs cleanup
router.get("/create/new", async (req, res) => {
  if (req.session.userId) {
    res.render("communities/new-community", {
      loginError: false,
      session: req.session,
      no_com: true,
    });
  } else {
    res.redirect("/site/login");
  }
});

router.post("/create/new", async (req, res) => {
  if (!req.session.userId) {
    res.redirect("/site/login");
  } else if (!req.body.name || !req.body.description) {
    res.render("communities/new-community", {
      message: "Fill all the fields to create a community",
      error: true,
    });
  } else {
    try {
      let name = req.body.name;
      let description = req.body.description;
      const done = communities.createCom(name, description, req.session.userId);
      if (done) {
        res.render("communities/success", {
          message: name + " Community successfully created",
          success: true,
          error: false,
          session: req.session,
        });
      }
    } catch (e) {
      console.log(e);
      res.render("communities/new-community", {
        message: e,
        error: true,
      });
    }
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    let communityId = req.params.id;
    let validate = validator.validateCommunityId(communityId);
    if (!validate.isValid) {
      res.status(400).render("communities/view_all_communities", { error: "No community present with id." });
      return;
    }
    let existingCommunity = await communities.getCommunityById(communityId);
    let subscribedUsers = [];
    // existingCommunity.subscribedUsers;
    for (const userId of existingCommunity.subscribedUsers) {
      let userDispName = await users.getDisplayNameByUserId(userId);
      console.log(userDispName);
      if (userDispName) subscribedUsers.push({ userId: userId, displayName: userDispName });
    }
    res.status(200).render("communities/edit_community", {
      community: existingCommunity,
      subscribedUsers: subscribedUsers,
    });
    return;
  } catch (e) {
    res.status(400).render("communities/view_existing_community", { error: "Something went wrong." });
    return;
  }
});

router.put("/:id", async (req, res) => {
  try {
    let communityId = req.params.id;
    let userId = req.session.userId;
    // console.log(req.session, userId);
    if (!userId) {
      // no user logged in
      res
        .status(401)
        .render("communities/view_all_communities", { error: "You've to be logged in to perform this action." });
      return;
    }
    let validateFlag =
      validator.validateCommunityEditPayload(req.body).isValid || validator.validateCommunityId(communityId).isValid;
    if (!validateFlag) {
      // TODO: Log errors locally
      res.status(400).render("communities/edit_community", { error: "Invalid edit operation for community." });
      return;
    }
    let editPayload = req.body;
    try {
      let editCommunity = await community.editCommunity(userId, communityId, editPayload);
      if (editCommunity.updateSuccess) {
        res
          .status(200)
          .render("communities/view_specific_community", { communityDetails: editCommunity.updatedCommunity });
        return;
      }
      res.status(500).render("communities/edit_community", { error: "Something went wrong." });
      return;
    } catch (e) {
      res.status(400).render("communities/edit_community", { error: e });
      return;
    }
  } catch (e) {
    console.log(e); // Logging errors locally
    res.status(500).render("communities/edit_community", { error: "Something went wrong." });
    return;
  }
});

router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: "No communityId found" });
    return;
  }
  try {
    const communityInfo = await communities.getCommunityById(req.params.id);
    if (!communityInfo) {
      res.status(400).json({ error: "No community for the Id" });
      return;
    }
    let reqQuestions = [];
    let questionCollection = await questions.getAllByCommunityId(req.params.id);
    for (let x of questionCollection) {
      reqQuestions.push({ _id: x._id, title: x.title, description: x.description });
    }
    let currentUser = req.session.userId;
    // check user if they subscribe the community
    if (currentUser === null) {
      res.render("communities/view_community_details", {
        communityInfo: communityInfo,
        isSubscribed: false,
        session: req.session,
        questions: reqQuestions,
        scriptUrl: ["scripts.js"],
      });
      return;
    } else {
      let allCommunityUser = communityInfo.community.subscribedUsers;
      for (let item of allCommunityUser) {
        console.log(currentUser);
        console.log(communityInfo.community.administrator);
        if (currentUser === item && currentUser === communityInfo.community.administrator) {
          res.render("communities/view_community_details", {
            communityInfo: communityInfo,
            isSubscribed: true,
            session: req.session,
            questions: reqQuestions,
            scriptUrl: ["scripts.js"],
            isAdmin: true,
          });
          return;
        }
      }
      res.render("communities/view_community_details", {
        communityInfo: communityInfo,
        isSubscribed: false,
        session: req.session,
        questions: reqQuestions,
        scriptUrl: ["scripts.js"],
      });
    }

    res.render("communities/view_community_details", {
      communityInfo: communityInfo,
      isSubscribed: false,
      session: req.session,
      questions: reqQuestions,
      scriptUrl: ["scripts.js"],
    });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post("/userSubscribe", async (req, res) => {
  if (!req.session.userId) {
    res.status(400).send("Please login first");
    return;
  }
  let userId = req.session.userId;
  // let userId = "2b14beb4-446e-44e3-a04f-855d5bf309ae";
  let communityId = req.body.communityId;
  if (!userId === undefined || !communityId) {
    res.status(400).send("Please login first");
    return;
  }
  if (userId.trim() === "" || communityId.trim() === "") {
    res.status(400).send("Please login first");
    return;
  }
  let currentStatus = JSON.parse(req.body.subscribeStatus);
  try {
    if (currentStatus) {
      let subscribeResult = await communities.userUnsubscribe(userId, communityId);
      res.json(subscribeResult);
    } else {
      let subscribeResult = await communities.userSubscribe(userId, communityId);
      res.json(subscribeResult);
    }
  } catch (e) {
    res.status(400).json(e);
    return;
  }
});

module.exports = router;
