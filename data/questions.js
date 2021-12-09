// Add DB operations on questions here.
const mongoCollections = require("../config/mongoCollections");
const validator = require("../helpers/dataValidators/questionValidator");
let questions = mongoCollections.questions;
let users = mongoCollections.users;
const uuid = require("uuid");

const getAllWithoutParams = async () => {
  const questionCollection = await questions();
  const allQuestions = await questionCollection.find({}).toArray();
  allQuestions.reverse();
  return allQuestions;
};

const createAns = async (userId, qId, ans) => {
  if (!ans || !qId) throw "Invalid parameters";
  const questionCollection = await questions();
  const answerToInsert = {
    _id: uuid.v4(),
    posterId: userId,
    description: ans,
    upvotes: [],
    downvotes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const answer = await questionCollection.updateOne(
    { _id: qId },
    {
      $push: {
        answers: answerToInsert,
      },
    }
  );

  if (answer.insertedCount === 0) throw "Could not add answer";
  return true;
};

const getAll = async (communityId, userId) => {
  if (communityId === undefined && userId === undefined) {
    throw `you must pass a parameter at least`;
  }
  const questionCollection = await questions();
  if (communityId !== undefined && communityId !== null && userId !== undefined && userId !== null) {
    const questionCollections = await questionCollection.find({ communityId: communityId, posterId: userId }).toArray();
    return questionCollections;
  } else if (communityId !== undefined || communityId !== null) {
    const questionCollections = await questionCollection.find({ communityId: communityId }).toArray();
    return questionCollections;
  } else {
    const questionCollections = await questionCollection.find({ posterId: userId }).toArray();
    return questionCollections;
  }
};

const getAllByUserId = async (userId) => {
  if (!userId) throw "No user id found";
  const questionsCollection = await questions();
  const questionsCollections = await questionsCollection.find({ posterId: userId }).toArray();
  return questionsCollections;
};

const getAllByCommunityId = async (communityId) => {
  if (!communityId) throw "No user id found";
  const questionsCollection = await questions();
  const questionsCollections = await questionsCollection.find({ communityId: communityId }).toArray();
  return questionsCollections;
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
    updatedAt: new Date(),
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

const addQuestion = async (title, description, posterId, community, tagsstring) => {
  //Initial testing-posterid is not available
  if (!title || !description || !community || !tagsstring) {
    throw " not a valid inputs";
  }
  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof community !== "string" ||
    typeof tagsstring !== "string" ||
    typeof posterId !== "string"
  ) {
    throw " not a valid inputs";
  }
  if (title.trim().length === 0) throw " error:empty string";
  if (description.trim().length === 0) throw " error:empty string";
  if (community.trim().length === 0) throw " error:empty string";
  if (tagsstring.trim().length === 0) throw " error:empty string";

  const questionsCollection = await questions();
  //To enter multiple tags users has to separate by spaces
  let tg = tagsstring.split(" ");
  let newQuestion = {
    _id: uuid.v4(),
    title: title,
    description: description,
    communityId: community,
    tags: tg,
    posterId: posterId,
    upvotes: [],
    downvotes: [],
    answers: [],
    acceptedAnswer: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const newInsertInformation = await questionsCollection.insertOne(newQuestion);
  if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
  return await getID(newInsertInformation.insertedId);
};

const getAllAnsweres = async (questionId) => {
  if (!questionId) throw "Error : No question ID found";
  let question = await getID(questionId);
  return question.answers;
};
const deleteAnswer = async (answerId) => {
  if (!answerId) throw " must provide id";
  if (typeof answerId !== "string") throw " id must be string";
  if (answerId.trim().length === 0) throw " error:empty string";
  const questionsCollection = await questions();

  let find = await questionsCollection.findOne({
    answers: { $elemMatch: { _id: answerId } },
  });
  if (find === null) throw "no  answer exist with that answerid";

  //deleteing the answer  from answers-sub document
  let fu = await questionsCollection.updateOne(
    { reviews: { $elemMatch: { _id: answerId } } },
    { $pull: { answers: { _id: answerId } } }
  );

  if (!fu.matchedCount && !fu.modifiedCount) throw "delete failed";

  let result = { answerId: answerId, deleted: true };
  return result;
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
  let allMatches = await questionsCollection.find({ $text: { $search: body.keyword } }).toArray();

  for (let x of tokenizedKeywords) {
    let allArrayMatches = await questionsCollection.find({ tags: x }).toArray();
    // console.log("each" + JSON.stringify(allArrayMatches));
    allMatches = allMatches.concat(allArrayMatches);
  }
  console.log("each", allMatches);
  let res = [...new Map(allMatches.map((v) => [v.id, v])).values()];
  console.log(res);
  // console.log(Object.values(res));
  console.log(tokenizedKeywords, res);
  return res;
};

const registerUpvote = async (questionId, userId) => {
  const questionsCollection = await questions();
  const existingQuestion = await questionsCollection.findOne({ _id: questionId });
  let newUpvotes = existingQuestion.upvotes;
  let newDownvotes = existingQuestion.downvotes;
  if (existingQuestion.upvotes.includes(userId)) {
    // upvote already done - toggle and remove userId from upvotes array.
    newUpvotes = newUpvotes.filter((item) => userId !== item);
    await questionsCollection.updateOne({ _id: questionId }, { $pull: { upvotes: userId } });
  }
  if (existingQuestion.downvotes.includes(userId)) {
    // upvote to be done while present in downvote array - toggle and remove userId from downvotes array and add it to upvotes array
    newDownvotes = newDownvotes.filter((item) => userId !== item);
    await questionsCollection.updateOne({ _id: questionId }, { $pull: { downvotes: userId } });
    await questionsCollection.updateOne({ _id: questionId }, { $addToSet: { upvotes: userId } });
  }
  if (!existingQuestion.upvotes.includes(userId) && !existingQuestion.downvotes.includes(userId)) {
    // user not present in both upvote and downvote array - add to upvote directly.
    await questionsCollection.updateOne({ _id: questionId }, { $addToSet: { upvotes: userId } });
  }
  return (await questionsCollection.findOne({ _id: questionId })).upvotes;
};

const registerDownvote = async (questionId, userId) => {
  const questionsCollection = await questions();
  const existingQuestion = await questionsCollection.findOne({ _id: questionId });
  let newUpvotes = existingQuestion.upvotes;
  let newDownvotes = existingQuestion.downvotes;
  if (existingQuestion.downvotes.includes(userId)) {
    // upvote already done - toggle and remove userId from upvotes array.
    newUpvotes = newUpvotes.filter((item) => userId !== item);
    await questionsCollection.updateOne({ _id: questionId }, { $pull: { downvotes: userId } });
  }
  if (existingQuestion.upvotes.includes(userId)) {
    // upvote to be done while present in downvote array - toggle and remove userId from downvotes array and add it to upvotes array
    newDownvotes = newDownvotes.filter((item) => userId !== item);
    await questionsCollection.updateOne({ _id: questionId }, { $pull: { upvotes: userId } });
    await questionsCollection.updateOne({ _id: questionId }, { $addToSet: { downvotes: userId } });
  }
  if (!existingQuestion.upvotes.includes(userId) && !existingQuestion.downvotes.includes(userId)) {
    // user not present in both upvote and downvote array - add to upvote directly.
    await questionsCollection.updateOne({ _id: questionId }, { $addToSet: { downvotes: userId } });
  }
  return (await questionsCollection.findOne({ _id: questionId })).downvotes;
};

module.exports = {
  remove,
  editQuestion,
  getID,
  getAll,
  createAns,
  addQuestion,
  getAllAnsweres,
  deleteAnswer,
  updateAnswer,
  getAllWithoutParams,
  search,
  registerUpvote,
  getAllByUserId,
  getAllByCommunityId,
  registerDownvote,
};
