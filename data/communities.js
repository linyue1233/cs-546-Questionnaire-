// Add DB operations on communities here.
 const mongoCollections = require("../config/mongoCollections");
const validator = require("../helpers/dataValidators/userValidator");
let communities = mongoCollections.communities;
const uuid = require("uuid");

const getAllcommunities = async () => {
  const communityCollections = await communities();
  const allCommunities = await communityCollections.find({}).toArray();
  return allCommunities;
}

module.exports = {
    getAllcommunities
  }; 