const mongoCollections = require("../config/mongoCollections");
let questions = mongoCollections.questions;

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

module.exports = {
  getAnswer,
};
