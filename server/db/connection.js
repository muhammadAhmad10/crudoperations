const mongoose = require("mongoose");
const connectionString = process.env.CONNECTION_STRING_MONGO || "";

// Connect to MongoDB
const connection = mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB..." + connectionString);
  })
  .catch((err) => console.error("Could not connect to MongoDB..."));

module.exports = connection;
