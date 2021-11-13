const MongoClient = require("mongodb").MongoClient;
const settings = require("./settings");
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

async function createSearchIndexesOnQuestionsColl(_db) {
  (await _db).collection("questions").createIndex({ title: "text", description: "text" }, { background: true });
}

async function getDb() {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _db = await _connection.db(mongoConfig.database);
  }
  createSearchIndexesOnQuestionsColl(_db);
  return _db;
}

async function getConnection() {
  return _connection;
}

module.exports = {
  getDb,
  getConnection,
};
