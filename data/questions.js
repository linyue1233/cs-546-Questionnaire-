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
