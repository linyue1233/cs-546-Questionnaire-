const express = require("express");
const router = express.Router();
const community = require("../data/communities");
const users = require("../data/users");
const validator = require("../helpers/routeValidators/communityValidator");
router.get("/", async (req, res) => {
    try{
        let com= await community.getAllcommunities()
        res.render("communities/getAllcommunity",{com:com})

    }catch(e){
        res.render("communities/getAllcommunity",e)

    }
  });





// Needs cleanup

router.get("/create/new", async (req, res) => {
  if (req.session.userId) {
    res.render("communities/new-community", {
      loginError: false,
      session: req.session,
    });
  } else {
    res.redirect("/site/login");
  }
});

router.post("/create/new", async (req, res) => {
  if (!req.session.userId) {
    res.redirect("/communities/create/new");
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

module.exports = router;
