const express = require("express");
const router = express.Router();
const question = require("../data/questions");

router.get("/", async (req, res) => {
  const questionList = await question.getAllWithoutParams();
  res.render("questions/all_questions", {
    session: req.session,
    questions: questionList,
  });
});

module.exports = router;
