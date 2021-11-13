// Add DB operations on questions here.
const mongoCollections = require('../config/mongoCollections');
const questions = mongoCollections.questions;
const uuid = require('uuid/v4');

let exportedMethods = {
  async getquestionById(id) {
        const questionsCollection = await questions();
        const question = await questionsCollection.findOne({ _id: id });
        if (!question) throw 'question not found';
        return question;
      },

  async addquestion(title,description,community,tagsstring,posterId) {
    //Initial testing-posterid is not available 
    if(!title || !description || !community || !tagsstring ){
      throw " not a valid inputs";
    }
    if (typeof title !== 'string' ||typeof description !== 'string' ||typeof community !== 'string' || typeof tagsstring !== 'string'){
      throw " not a valid inputs"

    }

    const questionsCollection = await questions();
    //To enter multiple tags users has to separate by spaces
    let tags=  tagsstring.split(" ")
    

    let newQuestion = {
      _id: uuid(),
      title:title,
      description:description,
      community:community,
      tags:tags,
      posterId:"testphase",
      upvotes:[],
      downvotes:[],
      answers:[],
      acceptedAnswer:"",
      createdAt:new Date(),
      updatedAt:new Date()
    };

    const newInsertInformation = await questionsCollection.insertOne(newQuestion);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    return await this.getquestionById(newInsertInformation.insertedId);
  },
  
  
};

module.exports = exportedMethods;
