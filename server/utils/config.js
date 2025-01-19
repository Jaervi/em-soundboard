require("dotenv").config();

let PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;
let AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
let AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
let AWS_REGION = process.env.AWS_REGION;
let S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
let JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  MONGODB_URI,
  PORT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  S3_BUCKET_NAME,
  JWT_SECRET,
};
