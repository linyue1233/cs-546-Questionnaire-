const questionsData = require('./questions');
const  usersData = require('./users');
const communityData=require('./communities')

module.exports = {
  users: usersData,
  questions: questionsData,
  communities: communityData
};
