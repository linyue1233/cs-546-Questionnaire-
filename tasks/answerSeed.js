const dbConnection = require("../config/mongoConnections");

const uuid = require("uuid");

async function main() {
  const db = await dbConnection.getDb();
  // db.createCollection("questions");
  var quescoll = await db.collection("questions");
  quescoll.createIndex({ title: "text", description: "text" });

  await quescoll.update(
    { _id: "b1b894d1-ed22-4122-87a4-c93cbc56abd8" },
    {
      $addToSet: {
        answers: {
          _id: uuid.v4(),
          description: "JS is a nice programming software.",
          comments: [],
          upvotes: [],
          downvotes: [],
          posterId: uuid.v4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    }
  );
  console.log("Done seeding database");

  (await dbConnection.getConnection()).close();
}

main();
