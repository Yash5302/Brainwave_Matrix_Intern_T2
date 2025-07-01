require('dotenv').config();

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("connection successful"))
  .catch((err) => console.error("MongoDB Error", err));

module.exports = mongoose.connection;