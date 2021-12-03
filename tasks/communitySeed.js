const dbConnection = require('../config/mongoConnections');
const uuid = require('uuid');

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