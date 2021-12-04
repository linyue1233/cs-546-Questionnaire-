// Add DB operations on communities here.
const mongoCollections = require("../config/mongoCollections");
let communities = mongoCollections.communities;
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
        questions: allQuestions.splice(0, 20)
    };
};

const userUnsubscribe = async (userId, communityId) => {
    if (!userId === undefined || !communityId) {
        throw `Please provide parameters`;
    }
    if (userId.trim() === "" || communityId.trim() === "") {
        thorw`Please provide parameters`;
    }
    const communitiesCollection = await communities();
    let community = await communitiesCollection.findOne({ _id: communityId });
    let allUsers = community.subscribedUsers;
    for(let item of allUsers){
        if(userId === item){
            const removedUserInfo = await communitiesCollection.updateOne({ _id: communityId}),{$pull:{subscribedUsers:userId}};
            if (removedUserInfo.modifiedCount == 0) {
                throw 'User does not exist';
            }else{
                return {subscribeStatus: false};
            }
        }
    }
    throw `User does not exist`;
};

const userSubscribe = async (userId, communityId) => {
    if (!userId === undefined || !communityId) {
        throw `Please provide parameters`;
    }
    if (userId.trim() === "" || communityId.trim() === "") {
        thorw`Please provide parameters`;
    }
    const communitiesCollection = await communities();
    const updateInfo = await communitiesCollection.updateOne(
        { _id: communityId},
        {$addToSet:{subscribedUsers:userId}}
    );
    if(updateInfo.modifiedCount == 0){
        throw `User does not exist`;
    }else{
        return{subscribeStatus:true};
    }

};

module.exports = {
    getCommunityById,
    userUnsubscribe,
    userSubscribe,
}