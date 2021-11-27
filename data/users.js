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

const userSignUp = async (firstName, lastName, password, emailAddress, avatarPath) => {
  // parames needed user firstName, lastName, emailAddress, password
  // if user's does not upload avatar, give him a default imageOrientation
  // produce createTime when signUp
  if (avatarPath === undefined) {
    avatarPath = "public/images/defaultAvatar.jpg";
  }
  if (firstName === undefined || lastName === undefined || emailAddress === undefined || password === undefined) {
    throw `Please provide all information.`;
  }
  const allUsers = await users();
  const usersList = await allUsers.find({}).toArray();
  // validate email and displayName

  lowerEmailAddress = emailAddress.toLowerCase();
  for (let item of usersList) {
    let tempUserName = item.username;
    let temp = tempUserName.toLocaleLowerCase();
    if (temp === lowerName) {
      return { userInserted: false };
    }
  }
};



module.exports = {
  deleteUser,
  checkUser,
};
