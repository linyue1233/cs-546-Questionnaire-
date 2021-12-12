const mongoCollections = require("../config/mongoCollections");
let questions = mongoCollections.questions;
const uuid = require("uuid");
const validator = require("../helpers/dataValidators/questionValidator");
const communities = mongoCollections.communities;

async function getanswerbyanserId(answerID) {
  if (!answerID) throw " must provide answerid";
  if (typeof answerID !== "string") throw " answerid must be string";
  if (answerID.trim().length === 0) throw " error:empty string";

  const questionCollection = await questions();
  const res = await questionCollection.find({}).toArray();
  for (let elem of res) {
    for (let anselement of elem.answers) {
      let k = anselement._id;
      anselement.questionId = elem._id;
      if (k === answerID) {
        return anselement;
      }
    }
  }
  throw "ans does not exist with that id";
}
const getAnswer = async (questionId, answerId) => {
  const questionCollection = await questions();
  let question = await questionCollection.findOne({ _id: questionId, "answers._id": answerId });
  if (!question) return null;
  let answers = question.answers;
  if (!answers) return null;
  let result = null;
  for (const answer of answers) {
    if (answer._id === answerId) {
      result = answer;
      break;
    }
  }
  return result;
};

const getAnswerByUserId = async (userId) => {
  if (!userId) throw "No User found";
  const questionCollection = await questions();
  const allQuestions = await questionCollection.find({}).toArray();
  let answers = [];
  for (let x of allQuestions) {
    for (let y of x.answers) {
      if (y.posterId == userId) answers.push({ _id: x._id, title: x.title });
    }
  }
  return answers;
};

const addComment = async (commentText, userId, answerId, questionId) => {
  if (!commentText) {
    throw `Please provide an valid comment.`;
  }
  commentText = commentText.trim();
  if (commentText.length === 0 || commentText.length >= 500) {
    throw `Please provide an valid comment.`;
  }
  if (!userId) {
    throw `Please login, then you can comment.`;
  }
  if (!answerId && !questionId) {
    throw `Something goes wrong with the question. Please refresh the page.`;
  }
  const questionCollection = await questions();
  const newComment = {
    _id: uuid.v4(),
    commenterId: userId,
    commentText: commentText,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  let signalQuestion = await questionCollection.findOne({ _id: questionId, "answers._id": answerId });
  let allAnswers = signalQuestion.answers;
  if (!allAnswers) {
    throw `There is a issue with our db.`;
  }
  for (let item of allAnswers) {
    if (item._id === answerId) {
      item.comments.push(newComment);
      break;
    }
  }
  const commentInfo = await questionCollection.updateOne(
    { _id: questionId },
    {
      $set: {
        answers: allAnswers,
      },
    }
  );
  if (commentInfo.insetCount === 0) {
    throw `Something wrong when insert comment.`;
  }
  return true;
};

// const reportAnswer = async (questionId, answerId, userId) => {
//   validator.validateId(questionId);
//   validator.validateId(answerId);
//   validator.validateId(userId);
//   const communityCollection = await communities();
//   const questionCollection = await questions();
//   const existingAnswer = await questionCollection.findOne({ _id: questionId, "answers._id": answerId });
//   if (!existingAnswer)
//     throw `No question found with the combination (questionId: ${questionId} - answerId: ${answerId})`;
//   // proceed with flagging
//   const communityIdOfAnswer = existingAnswer.communityId;
//   if (!communityIdOfAnswer) throw `Invalid configuration - needs datafix`;
//   let toAdd = {
//     // id will be the answer Id
//     _id: answerId,
//     questionId,
//     flag: 1
//   }
//   const flaggedAnswer = await communityCollection.updateOne({ _id: communityIdOfAnswer }, { $addToSet: { flaggedAnswers: {

//   }}});
// };

const reportAnswer = async (questionId, answerId, userId) => {
  validator.validateId(questionId);
  validator.validateId(userId);
  /*
  add to field
  [{ 
    _id: questionId,
    flag: 2
  }]
  */
  const questionsCollection = await questions();
  const communityCollection = await communities();
  const existingQuestion = await questionsCollection.findOne({ _id: questionId });
  if (!existingQuestion) {
    throw `No such question exists.`;
  }
  let existingCommunityId = existingQuestion.communityId;
  const presentCommunity = await communityCollection.findOne({ _id: existingCommunityId });
  if (!presentCommunity) {
    throw `Community Id for the given question is invalid - could've been deleted.`;
  }
  let count = 0;
  let isPresent = false;
  for (const answer of presentCommunity.flaggedAnswers) {
    console.log(answer._id, answerId, answer.reporterId, userId);
    if (answer._id === answerId && answer.reporterId === userId) {
      throw `User already reported this question.`;
    }
    if (answer._id === answerId) isPresent = true;
    // break;
  }

  // console.log(toAdd);
  if (isPresent) {
    const incrementReport = await communityCollection.updateOne(
      { _id: existingCommunityId, "flaggedAnswers._id": answerId },
      { $push: { "flaggedAnswers.$.reporterId": userId }, $inc: { "flaggedAnswers.$.flag": 1 } }
    );
  } else {
    const addToReport = await communityCollection.updateOne(
      { _id: existingCommunityId },
      { $push: { flaggedAnswers: { _id: answerId, questionId, reporterId: [userId], flag: 1 } } }
    );
  }
  return true;
};

module.exports = {
  getAnswer,
  getAnswerByUserId,
  getanswerbyanserId,
  addComment,
  reportAnswer,
};
