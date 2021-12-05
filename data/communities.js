// Add DB operations on communities here.
const mongoCollections = require("../config/mongoCollections");
const communities = mongoCollections.communities;
const validator = require("../helpers/dataValidators/communityValidator");
const uuid = require("uuid");
let questionData = require("../data/questions");
let userData = require("../data/users");

const createCom = async (name, description, userId) => {
  if (!name || !description) throw "Not a valid input";
  if (typeof name != "string" || typeof description != "string") throw "Not a valid input";

  const communityCollections = await communities();
  let newCom = {
    _id: uuid.v4(),
    name: name,
    description: description,
    questions: [],
    subscribedUsers: [userId],
    administrator: userId,
    flaggedQuestions: [],
    flaggedAnswers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const insertedInfo = await communityCollections.insertOne(newCom);
  if (insertedInfo.insertedCount == 0) throw "Insertion Failed";

  return true;
};

// const getCommunityById = async (communityId) => {
//   validator.validateCommunityId(communityId);
//   const communityCollection = await communities();
//   let existingCommunity = await communityCollection.findOne({ _id: communityId });
//   if (existingCommunity === null) {
//     throw `There's no community present with that id.`;
//   }
//   return existingCommunity;
// };

const getCommunityById = async (communityId) => {
  if (!communityId || communityId === undefined) {
      throw `Please provide communityId`;
  }
  // get a list of questions
  let allQuestions = await questionData.getAll(communityId);
  const communitiesCollection = await communities();
  let community = await communitiesCollection.findOne({ _id: communityId });
  if (community === null) {
      throw 'Error : Community not found';
  }
  return {
      community: community,
      questions: allQuestions.splice(0, 20)
  };
};


const editCommunity = async (userId, communityId, editPayload) => {
  validator.validateId(userId);
  validator.validateCommunityId(communityId);
  validator.validateCommunityEditPayload(editPayload);
  const communityCollection = await communities();
  let existingCommunity = await communityCollection.findOne({ _id: communityId });
  if (existingCommunity === null) {
    throw `There is no community matching the provided id.`;
  }
  if (existingCommunity.administrator !== userId) {
    throw `Current logged in user is not the administrator for this community <${communityId}>.`;
  }
  const updateCommunity = await communityCollection.updateOne(
    { _id: communityId },
    {
      $set: {
        name: editPayload.title,
        description: editPayload.description,
        administrator: editPayload.administrator,
      },
    }
  );
  if (updateCommunity.modifiedCount === 0) {
    throw `Something went wrong during community update.`;
  }
  return { updateSuccess: true, updatedCommunity: await communityCollection.findOne({ _id: communityId }) };
};

const userUnsubscribe = async (userId, communityId) => {
  if (!userId === undefined || !communityId) {
      throw `Please provide parameters`;
  }
  if (userId.trim() === "" || communityId.trim() === "") {
      thorw`Please provide parameters`;
  }
  const communitiesCollection = await communities();
  let community = await communitiesCollection.findOne({ _id: communityId });
  let allUsers = community.subscribedUsers;
  const index = allUsers.findIndex(item => item === userId);
  allUsers.splice(index, 1);
  const removeUser = await communitiesCollection.updateOne({ _id: communityId }, { $set: { subscribedUsers: allUsers } });
  if (removeUser.modifiedCount == 0) {
      throw 'User does not exist';
  } else {
      return { subscribeStatus: false };
  }
};

const userSubscribe = async (userId, communityId) => {
  if (!userId === undefined || !communityId) {
      throw `Please provide parameters`;
  }
  if (userId.trim() === "" || communityId.trim() === "") {
      thorw`Please provide parameters`;
  }
  const communitiesCollection = await communities();
  const updateInfo = await communitiesCollection.updateOne(
      { _id: communityId },
      { $addToSet: { subscribedUsers: userId } }
  );
  if (updateInfo.modifiedCount == 0) {
      throw `Failed to add`;
  } else {
      return { subscribeStatus: true };
  }

};
const getAllcommunities = async () => {
  const communityCollections = await communities();
  const allCommunities = await communityCollections.find({}).toArray();
  return allCommunities;
}

const addQuestiontocommunity = async (communityId,questionId) =>{
  validator.validateCommunityId(communityId);
  const communityCollection = await communities();
  let existingCommunity = await communityCollection.updateOne({ _id: communityId },{ $push: { questions: questionId } });
  if (existingCommunity === null) {
    throw `There's no community present with that id.`;
  }
  return true;
}

module.exports = {
  editCommunity,
  getCommunityById,
  createCom,
  userUnsubscribe,
  userSubscribe,
  getAllcommunities,
  addQuestiontocommunity
};

