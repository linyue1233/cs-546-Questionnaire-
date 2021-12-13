const dbConnection = require("../config/mongoConnections");
const uuid = require("uuid");
const { questions, users, communities } = require("./dump.js");

async function main() {
  const db = await dbConnection.getDb();
  const communitiesCollection = await db.collection("communities");
  const questionsCollection = await db.collection("questions");
  const usersCollection = await db.collection("users");
  questionsCollection.createIndex({ title: "text", description: "text" });
  await questionsCollection.insertMany(questions);
  await communitiesCollection.insertMany(communities);
  await usersCollection.insertMany(users);

  console.log("Done seeding database");
  (await dbConnection.getConnection()).close();
}

main();
