const express = require("express");
const router = express.Router();
const question = require("../data/questions");
const communities = require("../data/communities");
const xss = require("xss");
router.get("/", async (req, res) => {
  try {
    const questionList = await question.getAllWithoutParams();
    for (let x of questionList) {
      let reqCommunity = await communities.getCommunityById(x.communityId);
      x.communityName = reqCommunity.community.name;
      if (x.upvotes && x.downvotes) {
        let voteCount = x.upvotes.length - x.downvotes.length;
        x.voteCount = voteCount;
      }
    }
    res.render("questions/all_questions", {
      session: req.session,
      questions: questionList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).render("errors/internal_server_error", { session: req.session });
  }
});

module.exports = router;
