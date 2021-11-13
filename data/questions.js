// Add DB operations on questions here.
const mongoCollections = require("../config/mongoCollections");
const questions = mongoCollections.questions;

const search = async (body) => {
  /* Assuming the body comes like this:
     { keyword: <string> } */
  // TODO: add validation wherever necessary
  let tokenizedKeywords = body.keyword.split(" ");
  const questionsCollection = await questions();
  const allMatches = await questionsCollection.find({ $text: { $search: body.keyword } }).toArray();
  const allArrayMatches = await questionsCollection.find({ tags: tokenizedKeywords }).toArray();
  console.log(tokenizedKeywords, allArrayMatches);
  if (allArrayMatches.length > 0) {
    allMatches.push(allArrayMatches);
  }
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
