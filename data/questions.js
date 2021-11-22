// Add DB operations on questions here.
const mongoCollections = require("../config/mongoCollections");
const validator = require("../helpers/dataValidators/questionValidator");
let questions = mongoCollections.questions;

const getAllWithoutParams = async () => {
  const questionCollection = await questions();
  const allQuestions = await questionCollection.find({}).limit(30).toArray();
  return allQuestions;
};

const getAll = async (communityId, userId) => {
  if (arguments.length > 2) {
    throw `you can not pass any parameters`;
  }
  if (arguments.length === 0) {
    throw `you must pass a parameter at least`;
  }
  const questionCollection = await questions();
  if (communityId !== undefined && userId !== undefined) {
    const questionCollections = await questionCollection.find({ communityId: communityId, posterId: userId }).toArray();
    return questionCollections;
  } else if (communityId !== undefined) {
    const questionCollections = await questionCollection.find({ communityId: communityId }).toArray();
    return questionCollections;
  } else {
    const questionCollections = await questionCollection.find({ posterId: userId }).toArray();
    return questionCollections;
  }
};

const getID = async (id) => {
  if (!id) throw "Error : No ID found";
  const questionsCollection = await questions();

  let question = await questionsCollection.findOne({ _id: id });
  if (!question) throw "Error : Question not found";
  return question;
};

const editQuestion = async (id, title, description, tags, communityId) => {
  if (!id) throw "No ID found";
  if (!title || !description || !tags || !communityId) throw "No data found";

  const questionsCollection = await questions();

  let question = await questionsCollection.findOne({ _id: id });
  if (!question) throw "Question not found";
  let updateQuestion = {
    title: title,
    description: description,
    tags: tags,
    communityId: communityId,
  };
  const updatedInfo = await questionsCollection.updateOne({ _id: id }, { $set: updateQuestion });
  if (updatedInfo.modifiedCount == 0) throw "Could not update the question";
  return true;
};

const remove = async (id) => {
  // return the following object for deletion status: { deleted: true, id: id }
  // TODO: add validation wherever necessary
  const questionsCollection = await questions();
  const removedInfo = await questionsCollection.deleteOne({ _id: id });
  if (removedInfo.deletedCount === 0) {
    console.log("Something went wrong during question deletion!");
    return { deleted: false, id: id };
  }
  return { deleted: true, id: id };
};

const updateAnswer = async (questionId, answerId, body) => {
  const questionsCollection = await questions();
  validator.validateId(questionId);
  validator.validateId(answerId);
  validator.validateUpdateBody(body);
  const description = body.description;
  const updateQuestion = await questionsCollection.updateOne(
    { _id: questionId, "answers._id": answerId },
    { $set: { "answers.$.description": description } }
  );
  if (updateQuestion.modifiedCount === 0 && updateQuestion.matchedCount === 0) {
    throw `Something went wrong during answer update`;
  }
  // returning question with all answer information
  return await getID(questionId);
};

const search = async (body) => {
  /* Assuming the body comes like this:
     { keyword: <string> } */
  // TODO: add validation wherever necessary
  const questionsCollection = await questions();
  let tokenizedKeywords = body.keyword.split(" ");
  const allMatches = await questionsCollection.find({ $text: { $search: body.keyword } }).toArray();
  const allArrayMatches = await questionsCollection.find({ tags: tokenizedKeywords }).toArray();
  console.log(tokenizedKeywords, allArrayMatches);
  if (allArrayMatches.length > 0) {
    allMatches = allMatches.concat(allArrayMatches);
  }
  return allMatches;
};

module.exports = {
  search,
  remove,
  editQuestion,
  getID,
  getAll,
  updateAnswer,
  getAllWithoutParams,
};
