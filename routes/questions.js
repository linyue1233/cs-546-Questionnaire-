const express = require("express");
const router = express.Router();
const questions = require("../data/questions");
const data = require('../data');
const questionData = data.questions;
const validator = require("../helpers/routeValidators/questionValidator");

router.get("/search", async (req, res) => {
  let body = req.body;
  let validate = validator.validateSearchBody(body);
  if (!validate.isValid) {
    res.status(400).json({ error: validate.message });
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
  // FOR NOW, returning JSON
  res.status(200).json({ totalResults: searchResult.length, results: searchResult });
  // ideally, do this:
  // res.status(200).render("questions/search_results", { totalResults: searchResult.length, searchResult });
});


router.get("/:id", async (req, res) => {
  try {
    let quesiontAns = await questionData.getQuestionById(req.params.id);
    res.status(200).json(quesiontAns);
  } catch (e) {
    res.status(404).json({ error: "can not find restaurant with this id" });
  }
});

router.get("/", async (req, res) => {
  let communityId = req.query.communityId;
  let posterId = req.query.userId;
  if(communityId === undefined || posterId === undefined){
    res.status(400).json({error: 'You should provide valid parameters'});
    return;
  }
  try{
    const allQuestions = await questionData.getAllQuestions(communityId,posterId);
    res.status(200).json(allQuestions);
  }catch(e){
    res.status(500);
  }
})


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

module.exports = router;
