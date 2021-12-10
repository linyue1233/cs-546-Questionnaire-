// Add DB operations on users here.
const mongoCollections = require("../config/mongoCollections");
const validator = require("../helpers/dataValidators/userValidator");
const bcrypt = require("bcrypt");
let users = mongoCollections.users;
const saltRounds = 10;
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

const listUser = async (userId) => {
  validator.validateId(userId);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: userId });
  if (user === null) {
    throw `No user present with the id.`;
  }
  return user;
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
const updateUser = async (userId, firstName, lastName, profileImage) => {
  const userCollection = await users();

  if (!userId) throw "UserId must be present";
  if (!firstName) throw "firstName must be present";
  if (!lastName) throw "lastname must be present";
  if (!profileImage) throw "profileImage must be present";

  let userUpdateInfo = {
    firstName: firstName,
    lastName: lastName,
    profileImage: profileImage,
  };

  const updateInfo = await userCollection.updateOne({ _id: userId }, { $set: userUpdateInfo });
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Update failed";

  const updateduser = await userCollection.findOne({ _id: userId });
  return updateduser;
};

const getDisplayNameByUserId = async (userId) => {
  validator.validateId(userId);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: userId }, { $projection: { displayName: 1 } });
  return user.displayName;
};

const userSignUp = async (firstName, lastName, displayName, password, emailAddress, avatarPath) => {
  // parames needed user firstName, lastName, emailAddress, password
  // if user's does not upload avatar, give him a default imageOrientation
  // produce createTime when signUp
  if (avatarPath === undefined) {
    avatarPath = "defaultAvatar.jpg";
  }
  if (
    firstName === undefined ||
    lastName === undefined ||
    emailAddress === undefined ||
    password === undefined ||
    displayName === undefined
  ) {
    throw `Please provide all information.`;
  }

  firstName = firstName.trim();
  lastName = lastName.trim();
  emailAddress = emailAddress.trim();
  password = password.trim();
  displayName = displayName.trim();

  if(firstName.length === 0 || firstName.length >= 20 || !(/^[a-zA-Z]+$/g).test(firstName)){
    throw `Your firstName is invalid.`;
  }
  if(lastName.length === 0 || lastName.length >= 20 || !(/^[a-zA-Z]+$/g).test(lastName)){
    throw `Your lastName is invalid.`;
  }
  if(password.length <6 || (/^[ ]+$/g).test(password)){
    throw `Please provide 6 characters at least and password can not have white space`;
  }

  const userCollection = await users();
  const usersList = await userCollection.find({}).toArray();
  
  try {
    validator.validateEmailAddress(emailAddress);
  } catch (e) {
    throw e;
  }
  // validate email, displayName, password
  let lowerEmailAddress = emailAddress.toLowerCase();
  let lowerDisplayname = displayName.toLowerCase();
  for (let item of usersList) {
    let tempEmail = item.emailAddress;
    let temp = tempEmail.toLowerCase();
    if (temp === lowerEmailAddress) {
      throw `This email (${temp}) already exists.`;
    }

    let tempDisplayname = item.displayName.toLowerCase();
    temp = tempDisplayname.toLowerCase();
    if (temp === lowerDisplayname) {
      throw `This displayName (${temp}) is not available. Choose a different name.`;
    }
  }


  validator.validatePassword(password);
  const hash = await bcrypt.hash(password, saltRounds);

  let addUser = {
    _id: uuid.v4(),
    firstName: firstName,
    lastName: lastName,
    emailAddress: lowerEmailAddress,
    subscribedCommunities: [],
    adminCommunities: [],
    password: hash,
    profileImage: avatarPath,
    deleted: false,
    displayName: displayName,
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
  };

  const addRes = await userCollection.insertOne(addUser);
  if (addRes.insertedCount === 0) {
    throw `Something went wrong during add.`;
  }
  return { userInserted: true };
};

const getUserById = async (id) => {
  const userCollection = await users();
  return await userCollection.findOne({ _id: id });
};

module.exports = {
  deleteUser,
  checkUser,
  listUser,
  getDisplayNameByUserId,
  userSignUp,
  updateUser,
  getUserById,
};
