const mongoCollections = require("../config/mongoCollections");
const questions = mongoCollections.questions;

module.exports = {
    async update(id, title, description, tags, community){
        if (!id||!title||!description||!tags||!community) throw "Error: All fields are required";
        const questions = await questions();

        let question = await questions.findOne({_id:id});
        if (question == null) throw "Error: No question with that ID";
        let updateQuestion = {
            title: title,
            description: description,
            tags: tags,
            community: community,
        }
        const updatedInfo = await questions.updateOne(
            {_id: id},
            { $set: updateQuestion },
        );
        if (updatedInfo.modifiedCount==0) throw "Error: Could not update question"
        return true;
    }
}