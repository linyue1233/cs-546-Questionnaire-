// Add DB operations on communities here.
const mongoCollections = require("../config/mongoCollections");
let communities = mongoCollections.communities;
let questions = mongoCollections.questions;
let questionData = require("../data/questions");

const getCommunityById = async (communityId) => {
    if (!communityId || communityId === undefined) {
        throw `Please provide communityId`;
    }
    // get a list of questions
    let allQuestions = await questionData.getAll(communityId);
    const communitiesCollection = await communities();
    let community = await communitiesCollection.findOne({ _id: communityId });
    if (community === null) {
        throw 'Error : Community not found';
    }
    return {
        community: community,
        questions: allQuestions.splice(0,20)
    };
};

module.exports = {
    getCommunityById,
}