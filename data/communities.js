// Add DB operations on communities here.
const mongoCollections = require("../config/mongoCollections");
let communities = mongoCollections.communities;
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

module.exports = {
  createCom,
};
