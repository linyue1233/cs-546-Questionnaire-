const express = require("express");
const router = express.Router();
const questions = require("../data/questions");
const data = require('../data');
const questionData = data.questions;

router.get("/questions/search", async (req, res) => {
  // TODO fill in search questions code here.
});


router.get("/:id", async (req, res) => {
  try {
    let quesiontAns = await questionData.getQuestion(req.params.id);
    res.status(200).json(quesiontAns);
  } catch (e) {
    res.status(404).json({ error: "can not find restaurant with this id" });
  }
});

router.get("/", async (req, res) => {
  let communityId = req.query.communityId;
  let posterId = req.query.userId;
  if(communityId === undefined && posterId === undefined){
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


