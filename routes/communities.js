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
      res
        .status(400)
        .render("errors/internal_server_error", { message: "No community present with id.", session: req.session });
      return;
    }
    let existingCommunity = await communities.getCommunityById(communityId);
    if (req.session.userId != existingCommunity.community.administrator) {
      res.redirect(`/communities/${communityId}`);
    }
    let subscribedUsers = [];
    // existingCommunity.subscribedUsers;
    for (const userId of existingCommunity.community.subscribedUsers) {
      let userDispName = await users.getDisplayNameByUserId(userId);
      console.log(userDispName);
      if (userDispName) subscribedUsers.push({ userId: userId, displayName: userDispName });
    }
    res.status(200).render("communities/edit_community", {
      community: existingCommunity.community,
      subscribedUsers: subscribedUsers,
      session: req.session,
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).render("errors/internal_server_error", { message: "Something went wrong.", session: req.session });
    return;
  }
});

router.post("/communities/quickCreate", async (req, res) => {
  let content = req.body;
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
        if (currentUser === item) {
          if (currentUser === communityInfo.community.administrator) {
            res.render("communities/view_community_details", {
              communityInfo: communityInfo,
              isSubscribed: true,
              session: req.session,
              questions: reqQuestions,
              scriptUrl: ["scripts.js"],
              isAdmin: true,
            });
            return;
          } else {
            res.render("communities/view_community_details", {
              communityInfo: communityInfo,
              isSubscribed: true,
              session: req.session,
              questions: reqQuestions,
              scriptUrl: ["scripts.js"],
            });
            return;
          }
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

router.post("/quickCreate", async (req, res) => {
  let body = req.body;
  let validate = validator.validateQuickCreateBody(body);
  if (!validate.isValid) {
    res.status(400).json({ success: false, error: "Can't quick create community. Invalid input" });
    return;
  }
  const createCommunity = await communities.createCom(body.name, body.description, req.session.userId);
  if (createCommunity) {
    res.status(200).json({ success: true });
    return;
  }
  res.status(400).json({ success: false, error: "Can't quick create community" });
  return;
});

module.exports = router;
