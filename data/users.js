// Add DB operations on users here.
const mongoCollections = require("../config/mongoCollections");
const validator = require("../helpers/dataValidators/userValidator");
const bcrypt = require("bcrypt");
let users = mongoCollections.users;
const uuid = require("uuid");

const checkUser = async (emailAddress, password) => {
  validator.validateEmailAddress(emailAddress);
  validator.validatePassword(password);
  const userCollection = await users();
  const findUser = await userCollection.findOne({ emailAddress });
  if (findUser === null) {
    throw `No user identity found with this email address.`;
  }
  const comparison = await bcrypt.compare(password, findUser.password);
  if (!comparison) {
    throw `Invalid emailAddress/password combination.`;
  }
  return {
    authenticated: true,
    userId: findUser._id,
    userEmail: findUser.emailAddress,
    userDispName: findUser.displayName,
  };
};

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

module.exports = {
  deleteUser,
  checkUser,
};
