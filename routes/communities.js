const express = require("express");
const router = express.Router();
const community = require("../data/communities");
const communities = require("../data/communities");
const users = require("../data/users");
const questions = require("../data/questions");
const validator = require("../helpers/routeValidators/communityValidator");
const answers = require("../data/answers");
const xss = require("xss");

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
  if (xss(req.session.userId)) {
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
  if (!xss(req.session.userId)) {
    res.redirect("/site/login");
  } else if (!xss(req.body.name) || !xss(req.body.description)) {
    res.render("communities/new-community", {
      message: "Fill all the fields to create a community",
      error: true,
      session: req.session,
    });
  } else {
    try {
      let name = xss(req.body.name);
      let description = xss(req.body.description);
      const done = await communities.createCom(name, description, req.session.userId);
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
        session: req.session,
      });
    }
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    let communityId = xss(req.params.id);
    let validate = validator.validateCommunityId(communityId);
    if (!validate.isValid) {
      res.status(400).render("errors/internal_server_error", {
        message: "No community present with id.",
        session: req.session,
      });
      return;
    }
    let existingCommunity = await communities.getCommunityById(communityId);
    if (xss(req.session.userId) != existingCommunity.community.administrator) {
      res.redirect(`/communities/${communityId}`);
    }
    let subscribedUsers = [];
    // existingCommunity.subscribedUsers;
    for (const userId of existingCommunity.community.subscribedUsers) {
      let userDispName = await users.getDisplayNameByUserId(userId);
      if (userDispName) subscribedUsers.push({ userId: userId, displayName: userDispName });
    }
    res.status(200).render("communities/edit_community", {
      community: existingCommunity.community,
      subscribedUsers: subscribedUsers,
      session: req.session,
      scriptUrl: ["validateEditCommunity.js"],
    });
    return;
  } catch (e) {
    res.status(500).render("errors/internal_server_error", { message: "Something went wrong.", session: req.session });
    return;
  }
});

router.put("/:id", async (req, res) => {
  try {
    let communityId = xss(req.params.id);
    let userId = xss(req.session.userId);
    if (!userId) {
      // no user logged in
      res.status(401).redirect("/site/login");
      return;
    }
    let validateFlag =
      validator.validateCommunityEditPayload(xss(req.body)).isValid ||
      validator.validateCommunityId(communityId).isValid;
    if (!validateFlag) {
      // TODO: Log errors locally
      res.status(400).render("communities/edit_community", { error: "Invalid edit operation for community." });
      return;
    }
    console.log(req.body);
    let editPayload = {};
    for (const key in req.body) {
      console.log(req.body[key]);
      editPayload[key] = xss(req.body[key]);
    }
    console.log(editPayload);
    //let editPayload = req.body;
    try {
      let editCommunity = await community.editCommunity(userId, communityId, editPayload);
      if (editCommunity.updateSuccess) {
        res.redirect("/communities/" + req.params.id);
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
  if (!xss(req.params.id)) {
    res.status(400).json({ error: "No communityId found" });
    return;
  }
  try {
    const communityInfo = await communities.getCommunityById(xss(req.params.id));
    if (!communityInfo) {
      res.status(400).json({ error: "No community for the Id" });
      return;
    }
    let reqQuestions = [];
    let questionCollection = await questions.getAllByCommunityId(xss(req.params.id));
    for (let x of questionCollection) {
      reqQuestions.push({ _id: x._id, title: x.title, description: x.description });
    }
    let currentUser = xss(req.session.userId);
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
  if (!xss(req.session.userId)) {
    res.status(400).send("Please login first");
    return;
  }
  let userId = xss(req.session.userId);
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
  let currentStatus = JSON.parse(xss(req.body.subscribeStatus));
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
router.get("/:id/view/flagged", async (req, res) => {
  try {
    let communityId = xss(req.params.id);
    if (!xss(req.session.userId)) {
      res.redirect(`/communities/${communityId}`);
      return;
    }

    if (!xss(req.params.id)) {
      res.status(400).json({ error: "No communityId found" });
      return;
    }
    const communityInfo = await communities.getCommunityById(xss(req.params.id));
    if (!communityInfo) {
      res.status(400).json({ error: "No community for the Id" });
      return;
    }
    let adminId = communityInfo.community.administrator;
    if (adminId !== xss(req.session.userId)) {
      res.redirect(`/communities/${communityId}`);
      return;
    }
    let Queflageobj = communityInfo.community.flaggedQuestions;
    let queflag = [];
    for (const elem of Queflageobj) {
      const questionInfo = await questions.getID(elem._id);
      let t = questionInfo.title;
      let ans = {
        _id: elem._id,
        communitiyID: req.params.id,
        title: t,
        flag: elem.flag,
      };

      queflag.push(ans);
    }

    let ansflageobj = communityInfo.community.flaggedAnswers;
    let ansflag = [];

    for (const elem of ansflageobj) {
      const ansInfo = await answers.getanswerbyanserId(elem._id);
      let t = ansInfo.description;
      let ans = {
        _id: elem._id,
        communitiyID: req.params.id,
        title: t,
        flag: elem.flag,
      };

      ansflag.push(ans);
    }

    res.render("communities/viewflaggd", {
      qflag: queflag,
      aflag: ansflag,
      communitiyID: req.params.id,
      session: req.session,
    });
  } catch (e) {
    res.render("communities/viewflaggd", {
      error: e,
      communitiyID: req.params.id,
      session: req.session,
    });
  }
});
router.get("/:communitiyID/:questionId/delete/flaggedque", async (req, res) => {
  try {
    let cid = xss(req.params.communitiyID);
    let qid = xss(req.params.questionId);
    if (!xss(req.session.userId)) {
      res.redirect(`/communities/${cid}`);
      return;
    }
    if (!cid) {
      res.status(400).json({ error: "No communityId found" });
      return;
    }
    const communityInfo = await communities.getCommunityById(cid);
    if (!communityInfo) {
      res.status(400).json({ error: "No community for the Id" });
      return;
    }
    let adminId = communityInfo.community.administrator;
    if (adminId !== xss(req.session.userId)) {
      res.redirect(`/communities/${cid}`);
      return;
    }
    const answers = await questions.getAllAnsweres(qid);
    const com = await communities.getCommunityById(cid);
    const flaga = com.community.flaggedAnswers;

    let Ansarray = [];
    answers.forEach((element) => {
      Ansarray.push(element._id);
    });
    for (const element of flaga) {
      if (Ansarray.includes(element._id)) {
        let flaggedAns = await communities.deleteAnsewerfromflaggedAnsweres(cid, element._id);
      }
    }
    const question = await questions.remove(qid);

    let community = await communities.deleteQuestionfromcommunity(cid, qid);

    let flaggedQue = await communities.deleteQuestionfromflaggedQuestions(cid, qid);

    res.render("communities/viewdeletedflaggd", {
      c: req.params.communitiyID,
      message: "You have successfully deleted the Flagged Question",
      session: req.session,
    });
  } catch (e) {
    res.render("communities/viewdeletedflaggd", {
      c: req.params.communitiyID,
      error: e,
      session: req.session,
    });
  }
});
router.get("/:communitiyID/:answerId/delete/flaggedqans", async (req, res) => {
  try {
    let cid = xss(req.params.communitiyID);
    let aid = xss(req.params.answerId);
    const answer = await questions.deleteAnswer(aid);

    let flaggedAns = await communities.deleteAnsewerfromflaggedAnsweres(cid, aid);

    res.render("communities/viewdeletedflaggd", {
      c: xss(req.params.communitiyID),
      message: "You have successfully deleted the Flagged Answer",
    });
  } catch (e) {
    res.render("communities/viewdeletedflaggd", {
      c: xss(req.params.communitiyID),
      error: e,
      session: req.session,
    });
  }
});

router.post("/quickCreate", async (req, res) => {
  let body = xss(req.body);
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
