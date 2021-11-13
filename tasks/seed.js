
const dbConnection = require('../config/mongoConnections')
const data = require('../data/');
const questions = data.questions;


async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

 
 let doc1= await questions.addquestion("whats java","howtosolve error","community","tags string")
 let doc2= await questions.addquestion("python","python is not workingr","community","tagsstring")

  await db.serverConfig.close();
}

main();
