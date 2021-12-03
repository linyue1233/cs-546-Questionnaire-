const dbConnection = require("../config/mongoConnections");

const uuid = require("uuid");

async function main() {
  const db = await dbConnection.getDb();
  // db.createCollection("questions");
  var quescoll = await db.collection("questions");
  quescoll.createIndex({ title: "text", description: "text" });

  await quescoll.insertMany([
    {
      _id: uuid.v4(),
      title: "What is JS",
      description: "I need data about JS. What is JS?",
      communityId: uuid.v4(),
      tags: [],
      upvotes: [],
      downvotes: [],
      posterId: "47d3b23c-fda7-4580-adbe-40a9631340e4",
      answers: [],
      acceptedAnswer: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: uuid.v4(),
      title: "What are photons?",
      description: "Photons are interesting entities. Can someone give me some fun facts on that subject!?",
      communityId: "48cb0582-0528-4135-9a3f-98ed1adf4d86",
      tags: [],
      upvotes: [],
      downvotes: [],
      posterId: "47d3b23c-fda7-4580-adbe-40a9631340e4",
      answers: [],
      acceptedAnswer: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: uuid.v4(),
      title: "What is the LHC?",
      description: "guys, anyone know what the LHC is? is it as big as they claim it to be?",
      communityId: uuid.v4(),
      tags: [],
      upvotes: [],
      downvotes: [],
      posterId: "169cd704-2c40-48f9-aa06-a2f7ec22fe8b",
      answers: [],
      acceptedAnswer: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: uuid.v4(),
      title: "Hey, is the earth actually flat?",
      description:
        "I looked at some youtube videos where people were drawing triangles over photos. I think they are right. Should I be worried?",
      communityId: "48cb0582-0528-4135-9a3f-98ed1adf4d86",
      tags: [],
      upvotes: [],
      downvotes: [],
      posterId: "84d42ce8-321f-429c-9b56-5351d91959d9",
      answers: [],
      acceptedAnswer: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  console.log("Done seeding database");

  (await dbConnection.getConnection()).close();
}

main();
