const express = require("express");
const router = express.Router();
const question = require("../data/questions");
const communities = require("../data/communities");
const xss = require('xss');
router.get("/", async (req, res) => {
  try {
    const questionList = await question.getAllWithoutParams();
    for (let x of questionList) {
      let reqCommunity = await communities.getCommunityById(x.communityId);
      x.communityName = reqCommunity.community.name;
    }
    res.render("questions/all_questions", {
      session: req.session,
      questions: questionList,
    });
  } catch (e) {
    res.status(500).render("errors/internal_server_error", { session: req.session });
  }
});

module.exports = router;
