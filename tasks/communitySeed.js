const dbConnection = require("../config/mongoConnections");
const uuid = require("uuid");

async function main() {
  const db = await dbConnection.getDb();
  // db.createCollection("questions");
  var coll = await db.collection("communities");

  await coll.insertMany([
    {
      _id: uuid.v4(),
      name: "Photography",
      description: "This is a community about photography.",
      questions: [],
      subscribedUsers: [
        "078f84ba-92af-4375-9dc9-7f6aa20c7880",
        "a1e73d09-e7cd-41dd-9aec-74ddfbcd8caf",
        "84d42ce8-321f-429c-9b56-5351d91959d9",
      ],
      administrator: ["169cd704-2c40-48f9-aa06-a2f7ec22fe8b"],
      flaggedQuestions: [],
      flaggedAnswers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
  console.log("Done seeding database");

  (await dbConnection.getConnection()).close();
}

main();
