// Add DB operations on questions here.
const mongoCollections = require('../config/mongoCollections');
let questions = mongoCollections.questions;
const uuid = require('uuid/v4');

let exportMethods = {
    // get details of an individual question
    async getQuestionById(id){
        if(arguments.length > 1){
            throw `you can not pass more parameters`;
        }
        const questionCollection = await questions();
        const questionAns = await questionCollection.findOne({_id: id});
        if(questionAns === null){
            throw `no question with this id`;
        }
        return questionAns;
    },

    async getAllQuestions(communityId,userId){
        if(arguments.length !== 2){
            throw `You should pass right parameters`;
        }
        const questionCollection = await questions();
        
        const questionCollections = await questionCollection.find({communityId: communityId, posterId: userId}).toArray();
        return questionCollections;
    },
}

module.exports = exportMethods;

const search = async (body) => {
  /* Assuming the body comes like this:
     { keyword: <string> } */
  // TODO: add validation wherever necessary
  let tokenizedKeywords = body.keyword.split(" ");
  const questionsCollection = await questions();
  let allMatches = await questionsCollection.find({ $text: { $search: body.keyword } }).toArray();
  let allArrayMatches = await questionsCollection.find({ tags: tokenizedKeywords }).toArray();

  if (allArrayMatches.length > 0) {
    allMatches = allMatches.concat(allArrayMatches);
  }
  // console.log(allMatches);
  return allMatches;
};

const remove = async (id) => {
  // return the following object for deletion status: { deleted: true, id: id }
  // TODO: add validation wherever necessary
  const questionsCollection = await questions();
  const removedInfo = await questionsCollection.deleteOne({ _id: id });
  if (removedInfo.deletedCount === 0) {
    console.log("Something went wrong during question deletion!");
    return { deleted: false, id: id };
  }
  return { deleted: true, id: id };
};

module.exports = {
  search,
  remove,
};
