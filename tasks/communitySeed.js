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

async function produceCommunity(){
    const db = await dbConnection.getDb();
    var communityColl = await db.collection("communities");
    
    await communityColl.insertOne({
        _id: uuid.v4(),
        name:"JavaScript",
        description:"This is the community for JavaScript, you can discuss skills here",
        questions:["928efecc-56ba-4625-b6e7-1a426c7b60a9","dd8eb86a-5742-464d-9693-0fe4fb638196"],
        subscribedUsers:["2b14beb4-446e-44e3-a04f-855d5bf309ae","ea5a1cdd-ba00-45ad-a089-46f040f778aa"],
        administrator:"2b14beb4-446e-44e3-a04f-855d5bf309ae",
        flaggedQuestions:[],
        flaggedAnswers:[],
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log("Done seeding database");

    (await dbConnection.getConnection()).close();
}

produceCommunity();
