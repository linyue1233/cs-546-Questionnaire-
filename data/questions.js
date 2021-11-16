// Add DB operations on questions here.
const mongoCollections = require("../config/mongoCollections");
const questions = mongoCollections.questions;

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

const getID = async(id)=>{
  if (!id) throw "Error : No ID found";
  const questionsCollection = await questions();

  let question = await questionsCollection.findOne({_id: id});
  if (!question) throw "Error : Question not found";
  return question;
}

const editQuestion = async(id, title, description, tags, communityId)=>{
  if (!id) throw "No ID found";
  if (!title || !description || !tags || !communityId) throw "No data found";

  const questionsCollection = await questions();

  let question = await questionsCollection.findOne({_id: id});
  if (!question) throw "Question not found";
  let updateQuestion = {
    title: title,
    description: description,
    tags: tags,
    communityId: communityId,
  };
  const updatedInfo = await questionsCollection.updateOne(
    {_id:id},
    {$set:updateQuestion}
  );
  if (updatedInfo.modifiedCount == 0) throw "Could not update the question";
  return true;
}

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
  editQuestion,
  getID,
};
