// Add DB operations on communities here.
const mongoCollections = require("../config/mongoCollections");
const communities = mongoCollections.communities;
const validator = require("../helpers/dataValidators/communityValidator");

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

module.exports = {
  editCommunity,
  getCommunityById,
};
