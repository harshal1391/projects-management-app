var MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
let { mongoUrl } = process.env;
// Connection URL
var url = mongoUrl;
exports.connection = () => {
  return new Promise(async (resolve, reject) => {
    await MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) console.log("error", err);
        console.log("Connected correctly to database");
        var db = client.db("Assignment");
        resolve(db);
      }
    );
  });
};
// Use connect method to connect to the database
