// Add DB operations on questions here.
const mongoCollections = require('../config/mongoCollections');
let questions = mongoCollections.questions;


let exportMethods = {
    // get details of an individual question
    async getQuestionById(questionId){
        if(arguments.length > 1){
            throw `you can not pass more parameters`;
        }
        if(questionId == undefined){
            throw `you must provide an id for search`;
        }
        if(typeof id !== 'string'){
            throw 'Id must be a string';
        }
        if( id.trim() === ""){
            throw 'id is whitespace';
        }
        const questionCollection = await questions();
        const questionAns = await questionCollection.findOne({_id: questionId});
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
        
        const questionCollections = await questionCollection.find({'communityId': communityId, 'posterId': userId}).toArray();
        return questionCollections;
    }
}

module.exports = exportMethods;
