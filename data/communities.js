// Add DB operations on communities here.
const mongoCollections = require("../config/mongoCollections");
const communities = mongoCollections.communities;
const validator = require("../helpers/dataValidators/communityValidator");
const uuid = require("uuid");

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

const getCommunityById = async (communityId) => {
  validator.validateCommunityId(communityId);
  const communityCollection = await communities();
  let existingCommunity = await communityCollection.findOne({ _id: communityId });
  if (existingCommunity === null) {
    throw `There's no community present with that id.`;
  }
  return existingCommunity;
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

const getAllcommunities = async () => {
  const communityCollections = await communities();
  const allCommunities = await communityCollections.find({}).toArray();
  return allCommunities;
}

module.exports = {
  editCommunity,
  getCommunityById,
  createCom,
  getAllcommunities
};
