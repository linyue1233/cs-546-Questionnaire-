// Add DB operations on questions here.
const mongoCollections = require('../config/mongoCollections');
let questions = mongoCollections.questions;


let exportMethods = {
    // get details of an individual question
    async getQuestion(questionId){
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
        if(arguments.length > 2){
            throw `you can not pass any parameters`;
        }
        if(arguments.length === 0){
            throw `you must pass a parameter at least`;
        }
        const questionCollection = await questions();
        if( communityId !== undefined && userId !== undefined){
            const questionCollections = await questionCollection.find({'communityId': communityId, 'posterId': userId}).toArray();
            return questionCollections;
        }else if(communityId !== undefined){
            const questionCollections = await questionCollection.find({'communityId': communityId}).toArray();
            return questionCollections;
        }else{
            const questionCollections = await questionCollection.find({'posterId': userId}).toArray();
            return questionCollections;
        }
    }
}

module.exports = exportMethods;
