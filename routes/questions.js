const express = require("express");
const router = express.Router();
const questionsData = require("../data/questions");

router.get('/new', async (req, res) => {
  res.status(200).render('Questions/new', {});
});

router.post('/', async (req, res) => {
  const QuestionPostData = req.body;

  QuestionPostData.posterId="test";
  let errors=[];

  if (!QuestionPostData.title) {
    errors.push('You must provide the title');
  }
  if (!QuestionPostData.description) {
    errors.push('You must provide the description');
  }
  if (!QuestionPostData.posterId) {
    errors.push('You must provide the posterId');
  }
  if (!QuestionPostData.community) {
    errors.push('You must provide the community');
  }
  if (!QuestionPostData.tags) {
    errors.push('You must provide tags');
  }
  
  if (errors.length > 0) {
    res.render('questions/new', {
      errors: errors,
      hasErrors: true,
      title:QuestionPostData.title,
      description:QuestionPostData.description,
      community:QuestionPostData.community,
      tags:QuestionPostData.tags,


    });
    return;
  }
  

  try {
    const { title, description, posterId, community,tags } = QuestionPostData;
    const newQuestion = await questionsData.addquestion(title, description,posterId,community,tags);
    res.redirect(`/questions/${newQuestion._id}`);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;


