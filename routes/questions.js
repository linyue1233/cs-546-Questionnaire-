const express = require("express");
const router = express.Router();
const questions = require("../data/questions");
const answers = require("../data/answers");
const data = require("../data");
const questionData = data.questions;
const communityData = data.communities;
const xss = require("xss");
const userData = data.users;
const validator = require("../helpers/routeValidators/questionValidator");

router.get("/all", async (req, res) => {
  // const allQuestions = await questions.getAllWithoutParams();
  // console.log(allQuestions);
  // res.render("questions/all_questions", {
  //   questions: allQuestions,
  //   session: req.session,
  // });
  // return;
  res.redirect("/");
});

router.get("/:id/edit", async (req, res) => {
  if (xss(req.session.userId)) {
    if (xss(!req.params.id)) res.status(400).json({ error: "No id found" });
    try {
      const question = await questions.getID(xss(req.params.id));
      if (question.posterId != xss(req.session.userId)) {
        res.status(400).render("questions/edit-question", {
          error: "Unauthorized access",
          session: req.session,
        });
      } else {
        const com = await communityData.getAllcommunities();
        if (!question)
          res.status(400).render("questions/edit-question", {
            error: "No Question with that ID",
            session: req.session,
          });
        const comName = await communityData.getCommunityById(question.communityId);
        question.communityName = comName.community.name;
        for (let x of com) {
          if (x._id === question.communityId) {
            x.selected = true;
          }
        }
        res.render("questions/edit-question", {
          question: question,
          session: req.session,
          com: com,
        });
      }
    } catch (e) {
      res.status(500).render("questions/edit-question", {
        error: "No Question with that ID",
        session: req.session,
      });
    }
  } else {
    res.redirect(`/questions/${xss(req.params.id)}`);
  }
});

router.post("/search", async (req, res) => {
  // console.log(req.body);
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
    res.render("search/search_results", {
      result: false,
      session: req.session,
      searchTerm: body.keyword,
      searchTotal: "No Results",
    });
    return;
  }
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

router.put("/:id", async (req, res) => {
  let body = xss(req.body);
  try {
    if (!body) throw "";
    if (!body.title || !body.description || !body.tags || !body.communityId) throw "";
    if (!req.params.id) throw "";
  } catch (e) {
    res.status(500).render("questions/edit-question", {
      success: "Error! Incomplete or Invalid data. Try Again",
      session: req.session,
      id: req.params.id,
    });
  }
  try {
    const question = await questions.getID(xss(req.params.id));
    if (!question) throw "No question with that id";
    if (question.posterId != xss(req.session.userId)) throw "Unauthorized Access";
  } catch (e) {
    res.status(500).render("questions/edit-question", {
      error: e,
      session: req.session,
    });
    return;
  }
  try {
    const tagsArray = body.tags.split(",");
    for (let i = 0; i < tagsArray.length; i++) {
      tagsArray[i] = tagsArray[i].trim();
    }
    await questions.editQuestion(
      xss(req.params.id),
      xss(body.title),
      xss(body.description),
      tagsArray,
      xss(body.communityId)
    );
    res.status(200).render("questions/edit-question", {
      success: "Question edited successfully",
      session: req.session,
      id: req.params.id,
    });
  } catch (e) {
    res.status(500).render("errors/internal_server_error", {
      session: req.session,
    });
  }
});

router.get("/search", async (req, res) => {
  // res.json({ search: "success" });
  res.render("search/search", {});
});

router.get("/:id", async (req, res) => {
  let id = xss(req.params.id);
  try {
    let questionAns = await questionData.getID(xss(req.params.id));
    let thisQuestionPoster = questionAns.posterId;
    let userDetails = await userData.getUserById(thisQuestionPoster);
    // building answer object
    let answers = [];
    if (questionAns.answers) {
      for (const answer of questionAns.answers) {
        let answerPosterDetails = null;
        if (answer.posterId) {
          answerPosterDetails = await userData.getUserById(answer.posterId);
        }
        answers.push({
          _id: answer._id,
          posterId: answer.posterId,
          displayName: answerPosterDetails ? answerPosterDetails.displayName : "Unavailable User",
          description: answer.description,
          upvotes: answer.upvotes,
          downvotes: answer.downvotes,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        });
      }
    }

    // sort answer by vote
    sortedAnswer = answers.sort(function (a, b) {
      return b.upvotes.length - a.upvotes.length;
    });
    questionAns.answers = sortedAnswer;
    questionAns.friendlyCreatedAt = questionAns.createdAt.toDateString();
    questionAns.friendlyUpdatedAt = questionAns.updatedAt.toDateString();
    questionAns.votes = questionAns.upvotes.length - questionAns.downvotes.length;
    console.log(questionAns.upvotes.includes(req.session.userId), questionAns.downvotes.includes(req.session.userId));
    res.status(200).render("questions/individual-question", {
      questionInfo: questionAns,
      questionPoster: userDetails,
      thisUserUpvoted: questionAns.upvotes.includes(req.session.userId),
      thisUserDownvoted: questionAns.downvotes.includes(req.session.userId),
      currentUserPostedQuestion: xss(req.session.userId) === thisQuestionPoster ? true : false,
      session: req.session,
      scriptUrl: ["voteHandler.js"],
    });
  } catch (e) {
    res.status(404).render("errors/internal_server_error", { message: e });
  }
});

router.get("/", async (req, res) => {
  let communityId = xss(req.query.communityId);
  let posterId = xss(req.query.userId);
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

router.get("/:id/delete", async (req, res) => {
  res.status(500).render("errors/internal_server_error", {
    session: req.session,
  });
});

router.delete("/:id/delete", async (req, res) => {
  let id = xss(req.params.id);
  // TODO: apply validation wherever necessary
  if (xss(req.session.userId)) {
    try {
      let question = await questions.getID(id);
      if (!question) throw "No question with that id";
      if (question.posterId != req.session.userId) {
        res.status(400).render("questions/delete", {
          message: "Unauthorized access",
          session: req.session,
        });
      } else {
        question = await questions.remove(id);
        if (!question.deleted) {
          // ideally, do this:
          // res.status(200).render("questions/search_results", { totalResults: 0, searchResult });
          res.status(500).render("errors/internal_server_error", {
            session: req.session,
          });
        }
        res.status(200).render("questions/delete", {
          message: "Deletion successful",
          session: req.session,
        });
      }
    } catch (e) {
      res.status(500).render("errors/internal_server_error", {
        session: req.session,
      });
    }
  } else {
    res.redirect(`/questions/${id}`);
  }
});

router.get("/create/new", async (req, res) => {
  if (xss(req.session.userId)) {
    let com = await communityData.getAllcommunities();
    res.status(200).render("Questions/new", {
      com: com,
      session: req.session,
      no_ques: true,
      scriptUrl: ["quickCreateCommunity.js"],
    });
  } else {
    res.redirect("/site/login");
  }
});

router.post("/", async (req, res) => {
  if (xss(req.session.userId)) {
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

router.delete("/:questionId/answers/:answerId", async (req, res) => {
  let questionId = xss(req.params.questionId);
  let answerId = xss(req.params.answerId);
  const que = await questions.deleteAnswer(answerId);
  const questionInfo = await questions.getID(questionId);
  res.status(200).render("individual-question", questionInfo);
});

router.get("/:questionId/answers", async (req, res) => {
  if (!xss(req.params.questionId)) res.status(400).json({ error: "No id found" });
  try {
    const answersarray = await questions.getAllAnsweres(xss(req.params.questionId));
    let questionInfo = await questions.getID(xss(req.params.questionId));
    questionInfo.answeres = answersarray;
    res.status(200).render("questions/individual-question", { questionInfo: questionInfo });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.get("/:questionId/answers/:answerId/edit", async (req, res) => {
  let questionId = xss(req.params.questionId);
  let answerId = xss(req.params.answerId);
  let url = `/questions/${questionId}/answers/${answerId}`;
  let currentAnswer = await answers.getAnswer(questionId, answerId);
  // console.log(currentAnswer);
  res.render("answers/edit_answer", { url, currentAnswer });
});

//create an answer
router.post("/:id/answers/create/$", async (req, res) => {
  const body = xss(req.body.content);
  const questionId = xss(req.params.id);
  const userId = xss(req.session.userId);
  if (!body) error = "No content present in input";
  try {
    const insertAns = await questions.createAns(userId, questionId, body);
    if (insertAns) {
      res.redirect("/questions/" + req.params.id);
      return;
    }
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.put("/:questionId/answers/:answerId", async (req, res) => {
  let questionId = xss(req.params.questionId);
  let answerId = xss(req.params.answerId);
  let updatePayload = xss(req.body);
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
    res.redirect("/questions/" + req.params.questionId);
    return;
  } catch (e) {
    res.status(500).render("errors/internal_server_error");
    return;
  }
});

// get individual answer:
router.get("/:questionId/answers/:answerId", async (req, res) => {
  let questionId = xss(req.params.questionId);
  let answerId = xss(req.params.answerId);
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

router.post("/:id/upvote", async (req, res) => {
  if (!xss(req.session.userId)) {
    res.status(400).json({ success: false, message: "User not logged in." });
    return;
  }
  let questionId = xss(req.params.id);
  let userId = xss(req.session.userId);
  const upvotePersist = await questions.registerUpvote(questionId, userId);
  const questionDetails = await questions.getID(questionId);
  let count = questionDetails.upvotes.length - questionDetails.downvotes.length;
  // TODO further additions
  res.status(200).json({ count });
});

router.post("/:id/downvote", async (req, res) => {
  if (!req.session.userId) {
    res.status(400).json({ success: false, message: "User not logged in." });
    return;
  }
  let questionId = req.params.id;
  let userId = req.session.userId;
  const downvotePersist = await questions.registerDownvote(questionId, userId);
  const questionDetails = await questions.getID(questionId);
  let count = questionDetails.upvotes.length - questionDetails.downvotes.length;
  // TODO further additions
  res.status(200).json({ count });
});

module.exports = router;
