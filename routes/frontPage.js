const express = require("express");
const router = express.Router();
const question = require("../data/questions");
const communities = require("../data/communities");

router.get("/", async (req, res) => {
  const questionList = await question.getAllWithoutParams();
  for (let x of questionList) {
    let reqCommunity = await communities.getCommunityById(x.communityId);
    x.communityName = reqCommunity.community.name;
  }
  res.render("questions/all_questions", {
    session: req.session,
    questions: questionList,
  });
});

module.exports = router;
