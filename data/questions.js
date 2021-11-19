// Add DB operations on questions here.
const mongoCollections = require('../config/mongoCollections');
let questions = mongoCollections.questions;

const createAns = async (qId, ans) => {
  if (!ans || !qId) throw "Invalid parameters";
  const questionCollection = await questions();

  const answer = await questionCollection.updateOne({_id:qId},{$push : {answers: {
    description: ans
  }}});
  
  if (answer.insertedCount === 0) throw 'Could not add answer';
  return true;
}

const getAll = async (communityId, userId) => {
  if (arguments.length > 2) {
    throw `you can not pass any parameters`;
  }
  if (arguments.length === 0) {
    throw `you must pass a parameter at least`;
  }
  const questionCollection = await questions();
  if (communityId !== undefined && userId !== undefined) {
    const questionCollections = await questionCollection.find({ 'communityId': communityId, 'posterId': userId }).toArray();
    return questionCollections;
  } else if (communityId !== undefined) {
    const questionCollections = await questionCollection.find({ 'communityId': communityId }).toArray();
    return questionCollections;
  } else {
    const questionCollections = await questionCollection.find({ 'posterId': userId }).toArray();
    return questionCollections;
  }
}

const getID = async (id) => {
  if (!id) throw "Error : No ID found";
  const questionsCollection = await questions();

  let question = await questionsCollection.findOne({ _id: id });
  if (!question) throw "Error : Question not found";
  return question;
}

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
  const updatedInfo = await questionsCollection.updateOne(
    { _id: id },
    { $set: updateQuestion }
  );
  if (updatedInfo.modifiedCount == 0) throw "Could not update the question";
  return true;
}

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

module.exports = {
  remove,
  editQuestion,
  getID,
  getAll,
  createAns
};
