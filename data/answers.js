const mongoCollections = require("../config/mongoCollections");
let questions = mongoCollections.questions;

async function getanswerbyanserId(answerID) {
  if (!answerID) throw ' must provide answerid';
  if (typeof answerID !== 'string') throw ' answerid must be string';
  if (answerID.trim().length === 0) throw ' error:empty string';

    const questionCollection = await questions();
    const res = await questionCollection.find({}).toArray();
  for (let elem of res) {
    for (let anselement of elem.answers) {
      let k = anselement._id;
      if (k === answerID) {
        return anselement;
      }
    }
  }
  throw 'ans does not exist with that id';
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

module.exports = {
  getAnswer,
  getAnswerByUserId,
  getanswerbyanserId
};
