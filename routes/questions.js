const express = require("express");
const router = express.Router();
const questions = require("../data/questions");
const data = require("../data");
const questionData = data.questions;
const validator = require("../helpers/routeValidators/questionValidator");

router.get("/all", async (req, res) => {
  const allQuestions = await questions.getAllWithoutParams();
  console.log(allQuestions);
  res.render("questions/all_questions", { questions: allQuestions });
  return;
});

router.get("/:id/edit", async (req, res) => {
  if (!req.params.id) res.status(400).json({ error: "No id found" });
  try {
    const question = await questions.getID(req.params.id);
    if (!questions) res.status(400).json({ error: "No question with that id" });
    res.render("questions/edit-question", {
      question: question,
    });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post("/:id", async (req, res) => {
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
    res.status(200).json({ totalResults: 0, results: searchResult });
    return;
  }
  console.log(searchResult);
  // FOR NOW, returning JSON
  // res.status(200).json({ totalResults: searchResult.length, results: searchResult });
  // ideally, do this:
  // res.status(200).render("questions/search_results", { totalResults: searchResult.length, searchResult });
  res.status(200).render("search/search_results", {
    searchTerm: body.keyword,
    searchTotal: searchResult.length,
    searchResults: searchResult,
  });
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let questionAns = await questionData.getID(req.params.id);
    res.status(200).render("questions/individual-question", {
      questionInfo: questionAns,
    });
  } catch (e) {
    res.status(404).json({ error: "can not find question with this id" });
  }
});

router.get("/", async (req, res) => {
  let communityId = req.query.communityId;
  let posterId = req.query.userId;
  if (communityId === undefined || posterId === undefined) {
    res.status(400).json({ error: "You should provide valid parameters" });
    return;
  }
  try {
    const allQuestions = await questionData.getAll(communityId, posterId);
    res.status(200).json(allQuestions);
  } catch (e) {
    res.status(500);
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

router.get("/:questionId/answers/:answerId/edit", async (req, res) => {
  let questionId = req.params.questionId;
  let answerId = req.params.answerId;
  let url = `/questions/${questionId}/answers/${answerId}`;
  res.render("answers/edit_answer", { url });
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
    res.status(400).render("answers/edit_answer", { hasErrors: true, error: validate.message, body: updatePayload });
    return;
  }
  try {
    const updatedQuestionWithAnswer = await questions.updateAnswer(questionId, answerId, updatePayload);
    res.status(200).render("questions/individual-question.handlebars", { questionInfo: updatedQuestionWithAnswer });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).render("errors/internal_server_error.handlebars");
    return;
  }
});

module.exports = router;
