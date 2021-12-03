const dbConnection = require("../config/mongoConnections");
const bcrypt = require("bcrypt");

const uuid = require("uuid");

async function main() {
  const db = await dbConnection.getDb();
  // db.createCollection("questions");
  var usercoll = await db.collection("users");

  /*{
      _id: uuid.v4(),
      firstName: "Aravindh",
      lastName: "Shiva",
      displayName: "asgdev",
      emailAddress: "asgdev@qnr.com",
      password: await bcrypt.hash("test@123", 16),
      profileImage: null,
      deleted: false,
      subscribedCommunities: [],
      adminCommunities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } */

  // await usercoll.insertOne({
  //   _id: uuid.v4(),
  //   firstName: "Aravindh",
  //   lastName: "Shiva",
  //   displayName: "asgdev",
  //   emailAddress: "asgdev@qnr.com",
  //   password: await bcrypt.hash("test@123", 16),
  //   profileImage: null,
  //   deleted: false,
  //   subscribedCommunities: [],
  //   adminCommunities: [],
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // });

  await usercoll.insertMany([
    {
      _id: uuid.v4(),
      firstName: "Abdul",
      lastName: "Subhan",
      displayName: "abdul",
      emailAddress: "abdul@qnr.com",
      password: await bcrypt.hash("test@123", 16),
      profileImage: null,
      deleted: false,
      subscribedCommunities: [],
      adminCommunities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: uuid.v4(),
      firstName: "Kishan",
      lastName: "Kumar",
      displayName: "kishan",
      emailAddress: "kishan@qnr.com",
      password: await bcrypt.hash("test@123", 16),
      profileImage: null,
      deleted: false,
      subscribedCommunities: [],
      adminCommunities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: uuid.v4(),
      firstName: "Koushal",
      lastName: "AR",
      displayName: "koushal",
      emailAddress: "koushal@qnr.com",
      password: await bcrypt.hash("test@123", 16),
      profileImage: null,
      deleted: false,
      subscribedCommunities: [],
      adminCommunities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
  console.log("Done seeding database");

  (await dbConnection.getConnection()).close();
}

main();
