const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_NAME = process.env.MONGO_NAME;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(`MongoDB connected to ${MONGO_NAME}`))
  .catch((err) =>
    console.error(
      `Failed to connected to MongoDb uri ${MONGODB_URI} -  ${err.message}`
    )
  );

module.exports = mongoose;
