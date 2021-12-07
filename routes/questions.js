const express = require("express");
const router = express.Router();
const questions = require("../data/questions");
const answers = require("../data/answers");
const data = require("../data");
const questionData = data.questions;
const communityData = data.communities;
const userData = data.users;
const validator = require("../helpers/routeValidators/questionValidator");

router.get("/all", async (req, res) => {
  const allQuestions = await questions.getAllWithoutParams();
  console.log(allQuestions);
  res.render("questions/all_questions", {
    questions: allQuestions,
    session: req.session,
  });
  return;
});

router.get("/:id/edit", async (req, res) => {
  if (!req.params.id) res.status(400).json({ error: "No id found" });
  try {
    const question = await questions.getID(req.params.id);
    if (!questions) res.status(400).json({ error: "No question with that id" });
    res.render("questions/edit-question", {
      question: question,
      session: req.session,
    });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.put("/:id", async (req, res) => {
  let body = req.body;
  errors = "";
  if (!body) errors = "No data for updation found";
  if (!body.title || !body.description || !body.tags || !body.communityId) error = "Incomplete Data received";
  if (!req.params.id) errors = "No ID found";

  try {
    const question = await questions.getID(req.params.id);
    if (!question) throw "No question with that id";
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }
  try {
    const tagsArray = body.tags.split(",");
    for (let i = 0; i < tagsArray.length; i++) {
      tagsArray[i] = tagsArray[i].trim();
    }
    await questions.editQuestion(req.params.id, body.title, body.description, tagsArray, body.communityId);
    res.status(200).json({ Message: "Updation Complete" });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/search", async (req, res) => {
  console.log("GET: /search");
  // res.json({ search: "success" });
  res.render("search/search", {});
});

router.post("/search", async (req, res) => {
  let body = req.body;
  let validate = validator.validateSearchBody(body);
  if (!validate.isValid) {
    res.status(400).json({ hasErrors: true, error: validate.message });
    return;
  }
  // TODO: apply validation wherever necessary
  /* Assuming the body comes like this:
  { keyword: <string> } */
  const searchResult = await questions.search(body);
  if (searchResult.length === 0) {
    // Sending 200 here as it is search. There can be valid cases where the search result might turn up no results.
    // ideally, do this:
    // res.status(200).render("questions/search_results", { totalResults: 0, searchResult });
    // FOR NOW, returning JSON
    res.render("search/search_results", {
      result: false,
      session: req.session,
      searchTerm: body.keyword,
      searchTotal: "No Results",
    });
    return;
  }
  console.log(searchResult);
  // FOR NOW, returning JSON
  // res.status(200).json({ totalResults: searchResult.length, results: searchResult });
  // ideally, do this:
  // res.status(200).render("questions/search_results", { totalResults: searchResult.length, searchResult });
  res.status(200).render("search/search_results", {
    result: true,
    searchTerm: body.keyword,
    searchTotal: searchResult.length,
    searchResults: searchResult,
    session: req.session,
  });
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let questionAns = await questionData.getID(req.params.id);
    let userDisplayName = await userData.getDisplayNameByUserId(questionAns.posterId);
    res.status(200).render("questions/individual-question", {
      questionInfo: questionAns,
      userDisplayName: userDisplayName,
      session: req.session,
    });
  } catch (e) {
    res.status(404).json({ error: "can not find question with this id" });
  }
});

router.get("/", async (req, res) => {
  let communityId = req.query.communityId;
  let posterId = req.query.userId;
  // provide one parameter is ok
  if (communityId === undefined && posterId === undefined) {
    res.status(400).json({ error: "You should provide valid parameters" });
    return;
  }
  try {
    const allQuestions = await questionData.getAll(communityId, posterId);
    res.status(200).render("questions/all_questions", {
      questions: allQuestions,
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete("/:id/delete", async (req, res) => {
  let id = req.params.id;
  // TODO: apply validation wherever necessary
  const question = await questions.remove(id);
  if (!question.deleted) {
    // ideally, do this:
    // res.status(200).render("questions/search_results", { totalResults: 0, searchResult });
    res.status(500).json({ error: "Something went wrong! " });
    return;
  }
  res.status(200).json({ deleted: question.deleted, id: question.id });
});

router.get("/create/new", async (req, res) => {
  if (req.session.userId) {
    let com = await communityData.getAllcommunities();
    res.status(200).render("Questions/new", { com: com, session: req.session, no_ques: true });
  } else {
    res.redirect("/site/login");
  }
});

router.post("/", async (req, res) => {
  if (req.session.userId) {
    const QuestionPostData = req.body;

    QuestionPostData.posterId = req.session.userId;
    let errors = [];

    if (!QuestionPostData.title) {
      errors.push("You must provide the title");
    }
    if (!QuestionPostData.description) {
      errors.push("You must provide the description");
    }
    if (!QuestionPostData.posterId) {
      errors.push("You must provide the posterId");
    }
    if (!QuestionPostData.community) {
      errors.push("You must provide the community");
    }
    if (!QuestionPostData.tags) {
      errors.push("You must provide tags");
    } else if (
      QuestionPostData.title.length === 0 ||
      QuestionPostData.description.trim().length === 0 ||
      QuestionPostData.community.trim().length === 0 ||
      QuestionPostData.tags.trim().length === 0
    )
      errors.push("Invalid Input: Empty Data");

    if (errors.length > 0) {
      let com = await communityData.getAllcommunities();
      res.status(400).render("Questions/new", {
        com: com,
        errors: errors,
        hasErrors: true,
        title: QuestionPostData.title,
        description: QuestionPostData.description,
        community: QuestionPostData.community,
        tags: QuestionPostData.tags,
      });
      return;
    }

    try {
      const { title, description, posterId, community, tags } = QuestionPostData;
      const newQuestion = await questions.addQuestion(title, description, posterId, community, tags);
      const addQuetoCom = await communityData.addQuestiontocommunity(community, newQuestion._id);

      res.redirect(`/questions/${newQuestion._id}`);
      // res.status(200).json({ msg: 'question has been added to db' });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.redirect("/site/login");
  }
});

router.delete("/:questionId/answers/:answerId/edit", async (req, res) => {
  let questionId = req.params.questionId;
  let answerId = req.params.answerId;
  const que = await questions.deleteAnswer(answerId);
  const questionInfo = await questions.getID(questionId);
  res.status(200).render("individual-question", questionInfo);
});

router.get("/:questionId/answers", async (req, res) => {
  if (!req.params.questionId) res.status(400).json({ error: "No id found" });
  try {
    const answersarray = await questions.getAllAnsweres(req.params.questionId);
    let questionInfo = await questions.getID(req.params.questionId);
    console.log(questionInfo);
    questionInfo.answeres = answersarray;
    res.status(200).render("questions/individual-question", { questionInfo: questionInfo });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});
router.get("/:questionId/answers/:answerId/edit", async (req, res) => {
  let questionId = req.params.questionId;
  let answerId = req.params.answerId;
  let url = `/questions/${questionId}/answers/${answerId}`;
  let currentAnswer = await answers.getAnswer(questionId, answerId);
  // console.log(currentAnswer);
  res.render("answers/edit_answer", { url, currentAnswer });
});

router.put("/:questionId/answers/:answerId", async (req, res) => {
  let questionId = req.params.questionId;
  let answerId = req.params.answerId;
  let updatePayload = req.body;
  /* Assuming the update body as below:
  {
    description: "CONTENT",
  }
  */
  let validate = validator.validateUpdateBody(updatePayload);
  if (!validate.isValid) {
    // sending body to retain old values in the form
    res.status(400).render("answers/edit_answer", {
      hasErrors: true,
      error: validate.message,
      body: updatePayload,
    });
    return;
  }
  try {
    const updatedQuestionWithAnswer = await questions.updateAnswer(questionId, answerId, updatePayload);
    res.status(200).render("questions/individual-question.handlebars", {
      questionInfo: updatedQuestionWithAnswer,
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).render("errors/internal_server_error.handlebars");
    return;
  }
});

// get individual answer:
router.get("/:questionId/answers/:answerId", async (req, res) => {
  let questionId = req.params.questionId;
  let answerId = req.params.answerId;
  if (questionId.trim() === "") {
    res.status(400).json({ error: "You should provide questionId" });
    return;
  }
  if (answerId.trim() === "") {
    res.status(400).json({ error: "You should provide answerId" });
    return;
  }
  try {
    const individualQustion = await questionData.getID(questionId);
    const answerList = individualQustion.answers;
    for (let answer of answerList) {
      if (answerId === answer._id) {
        res.status(200).render("answers/new_answer_form", {
          question: individualQustion,
          singalAnswer: answer,
        });
      }
      return;
    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
  res.status(404).json({ error: "Error: No answer found" });
});

//create an answer
router.post("/:id/answers/create", async (req, res) => {
  const body = req.body;
  error = "";
  if (!body) error = "No data found for updation";
  try {
    await questions.createAns(req.params.id, body);
    res.redirect("/questions/req.params.id");
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

module.exports = router;
