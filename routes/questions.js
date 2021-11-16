const express = require("express");
const router = express.Router();
const questions = require("../data/questions");
const validator = require("../helpers/routeValidators/questionValidator");

router.get("/:id/edit", async(req,res)=> {
  if (!req.params.id) res.status(400).json({error: "No id found"});
  try{
    const question = await questions.getID(req.params.id);
    if (!questions) res.status(400).json({error: "No question with that id"});
    res.render("questions/edit-question",{
      question: question
    });
  }catch(e){
    res.status(400).json({error: e});
  }
});

router.post("/:id", async(req,res)=>{
  let body = req.body;
  errors = "";
  if (!body) errors = "No data for updation found";
  if (!body.title || !body.description || !body.tags || !body.communityId) error="Incomplete Data received";
  if (!req.params.id) errors = "No ID found";

  try{
    const question = await questions.getID(req.params.id);
    if (!question) throw "No question with that id";
  }catch(e){
    res.status(400).json({error: e})
  }
  try{
    const tagsArray = body.tags.split(",");
    for(let i=0;i<tagsArray.length;i++){
      tagsArray[i]=tagsArray[i].trim();
    }
    await questions.editQuestion(req.params.id, body.title, body.description, tagsArray, body.communityId);
    res.status(200).json({Message: "Updation Complete"})
  }catch(e){
    res.status(500).json({error: e});
  }
});

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
