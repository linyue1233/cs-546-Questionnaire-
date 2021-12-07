const express = require("express");
const router = express.Router();
const question = require("../data/questions");
const communities = require("../data/communities");

router.get("/", async (req, res) => {
  try {
    const questionList = await question.getAllWithoutParams();
    for (let x of questionList) {
      console.log(x);
      let reqCommunity = await communities.getCommunityById(x.communityId);
      x.communityName = reqCommunity.community.name;
    }
    res.render("questions/all_questions", {
      session: req.session,
      questions: questionList,
    });
  } catch (e) {}
});

module.exports = router;
