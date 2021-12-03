const dbConnection = require("../config/mongoConnections");

const uuid = require("uuid");

async function main() {
  const db = await dbConnection.getDb();
  // db.createCollection("questions");
  var usercoll = await db.collection("users");

  await usercoll.insertOne({
    _id: uuid.v4(),
    firstName: "Aravindh",
    lastName: "Shiva",
    displayName: "asgdev",
    emailAddress: "asgdev@qnr.com",
    profileImage: null,
    deleted: false,
    subscribedCommunities: [],
    adminCommunities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await usercoll.insertOne({
    _id: uuid.v4(),
    firstName: "Aravindh2",
    lastName: "Shiva",
    displayName: "asgdev",
    emailAddress: "asgdev@qnr.com",
    profileImage: null,
    deleted: false,
    subscribedCommunities: [],
    adminCommunities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await usercoll.insertOne({
    _id: uuid.v4(),
    firstName: "Aravindh3",
    lastName: "Shiva",
    displayName: "asgdev",
    emailAddress: "asgdev@qnr.com",
    profileImage: null,
    deleted: false,
    subscribedCommunities: [],
    adminCommunities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await usercoll.insertOne({
    _id: uuid.v4(),
    firstName: "Aravindh4",
    lastName: "Shiva",
    displayName: "asgdev",
    emailAddress: "asgdev@qnr.com",
    profileImage: null,
    deleted: false,
    subscribedCommunities: [],
    adminCommunities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await usercoll.insertOne({
    _id: uuid.v4(),
    firstName: "Aravindh5",
    lastName: "Shiva",
    displayName: "asgdev",
    emailAddress: "asgdev@qnr.com",
    profileImage: null,
    deleted: false,
    subscribedCommunities: [],
    adminCommunities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  console.log("Done seeding database");

  (await dbConnection.getConnection()).close();
}

main();
