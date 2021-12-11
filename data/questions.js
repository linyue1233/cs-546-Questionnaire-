// Add DB operations on questions here.
const mongoCollections = require("../config/mongoCollections");
const validator = require("../helpers/dataValidators/questionValidator");
let questions = mongoCollections.questions;
let users = mongoCollections.users;
const uuid = require("uuid");
let community = mongoCollections.communities;

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
    { answers: { $elemMatch: { _id: answerId } } },
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
  return allMatches;
};

const registerUpvote = async (questionId, userId) => {
  validator.validateId(questionId);
  validator.validateId(userId);
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
  validator.validateId(questionId);
  validator.validateId(userId);
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

const reportQuestion = async (questionId, userId) => {
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
  const communityCollection = await community();
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
  for (const question of presentCommunity.flaggedQuestions) {
    if (question.reporterId === userId) {
      throw `User already reported this question.`;
    }
    if (question._id === questionId) isPresent = true;
    break;
  }

  // console.log(toAdd);
  if (isPresent) {
    const incrementReport = await communityCollection.updateOne(
      { _id: existingCommunityId, "flaggedQuestions._id": questionId },
      { $inc: { "flaggedQuestions.$.flag": 1 } }
    );
  } else {
    const addToReport = await communityCollection.updateOne(
      { _id: existingCommunityId },
      { $push: { flaggedQuestions: { _id: questionId, reporterId: userId, flag: 1 } } }
    );
  }
  return true;
};

const registerUpvoteForAnswer = async (questionId, answerId, userId) => {
  validator.validateId(questionId);
  validator.validateId(answerId);
  validator.validateId(userId);
  const questionCollection = await questions();
  const existingQuestion = await questionCollection.findOne({ _id: questionId, "answers._id": answerId });
  if (!existingQuestion) throw `No question present with id (${questionId}) and answer (${answerId})`;
  for (const answer of existingQuestion.answers) {
    if (answer.upvotes.includes(userId)) {
      // upvote already done - toggle and remove userId from upvotes array.
      await questionCollection.updateOne(
        { _id: questionId, "answers._id": answerId },
        { $pull: { "answers.$.upvotes": userId } }
      );
    }
    if (answer.downvotes.includes(userId)) {
      // upvote to be done while present in downvote array - toggle and remove userId from downvotes array and add it to upvotes array
      await questionCollection.updateOne(
        { _id: questionId, "answers._id": answerId },
        { $pull: { "answers.$.downvotes": userId } }
      );
      await questionCollection.updateOne(
        { _id: questionId, "answers._id": answerId },
        { $addToSet: { "answers.$.upvotes": userId } }
      );
    }
    if (!answer.upvotes.includes(userId) && !answer.downvotes.includes(userId)) {
      // user not present in both upvote and downvote array - add to upvote directly.
      await questionCollection.updateOne(
        { _id: questionId, "answers._id": answerId },
        { $addToSet: { "answers.$.upvotes": userId } }
      );
    }
  }
  // return final count here
  const question = await questionCollection.findOne({ _id: questionId, "answers._id": answerId });
  let count = 0;
  for (const answer of question.answers) {
    if (answerId === answer._id) {
      count = answer.upvotes.length - answer.downvotes.length;
    }
  }
  return count;
};

const registerDownvoteForAnswer = async (questionId, answerId, userId) => {
  validator.validateId(questionId);
  validator.validateId(answerId);
  validator.validateId(userId);
  const questionCollection = await questions();
  const existingQuestion = await questionCollection.findOne({ _id: questionId, "answers._id": answerId });
  if (!existingQuestion) throw `No question present with id (${questionId}) and answer (${answerId})`;
  for (const answer of existingQuestion.answers) {
    if (answer.downvotes.includes(userId)) {
      await questionCollection.updateOne(
        { _id: questionId, "answers._id": answerId },
        { $pull: { "answers.$.downvotes": userId } }
      );
    }
    if (answer.upvotes.includes(userId)) {
      await questionCollection.updateOne(
        { _id: questionId, "answers._id": answerId },
        { $pull: { "answers.$.upvotes": userId } }
      );
      await questionCollection.updateOne(
        { _id: questionId, "answers._id": answerId },
        { $addToSet: { "answers.$.downvotes": userId } }
      );
    }
    if (!answer.upvotes.includes(userId) && !answer.downvotes.includes(userId)) {
      await questionCollection.updateOne(
        { _id: questionId, "answers._id": answerId },
        { $addToSet: { "answers.$.downvotes": userId } }
      );
    }
  }
  // return final count here
  const question = await questionCollection.findOne({ _id: questionId, "answers._id": answerId });
  let count = 0;
  for (const answer of question.answers) {
    if (answerId === answer._id) {
      count = answer.upvotes.length - answer.downvotes.length;
    }
  }
  return count;
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
  reportQuestion,
  registerUpvoteForAnswer,
  registerDownvoteForAnswer,
};
