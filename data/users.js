// Add DB operations on users here.
const mongoCollections = require("../config/mongoCollections");
const validator = require("../helpers/dataValidators/userValidator");
let users = mongoCollections.users;
const uuid = require("uuid");

const deleteUser = async (userId) => {
  validator.validateId(userId);
  const userCollection = await users();
  const userToDelete = await userCollection.findOne({ _id: userId });
  if (userToDelete === null) {
    throw `No user present with the id.`;
  }
  let deletedUser = {
    firstName: "Deleted User",
    lastName: "",
    emailAddress: "",
    subscribedCommunities: [],
    adminCommunities: [],
    password: null,
    deleted: true,
    displayName: "deletedUser_" + uuid.v1().slice(0, 8),
    updatedAt: new Date().toUTCString(),
  };
  const updateUser = await userCollection.updateOne({ _id: userId }, { $set: deletedUser });
  if (updateUser.modifiedCount === 0) {
    throw `Something went wrong during deletion.`;
  }
  return { deleted: true, _id: userId };
};

const userSignUp = async()


module.exports = {
  deleteUser,
};
