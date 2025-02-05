const dotenv = require("dotenv").config();

const mongodbUsername = process.env.MONGODB_USERNAME;
const mongodbPassword = process.env.MONGODB_PASSWORD;
const mongodbCluster = process.env.MONGODB_CLUSTER;
const mongodbNet = process.env.MONGODB_NET;
const mongodbDataBase = process.env.MONGODB_DATABASE;

module.exports = {
  connectionString:
  `mongodb+srv://${mongodbUsername}:${mongodbPassword}@${mongodbCluster}.${mongodbNet}.mongodb.net/${mongodbDataBase}`,
};