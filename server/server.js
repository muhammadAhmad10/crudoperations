const express = require("express");
const cors = require("cors");
require("./loadEnvironment.js");
const app = express();
const mongoose = require("mongoose");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectionString = process.env.CONNECTION_STRING_MONGO || "";
const PORT = process.env.PORT || 5050;

// Api Route
app.use("/api/recipes", require("./routes/api/recipeOperations.js"));

// Default Route
app.use("/", (req, res) => {
  res.send("Welcome to the Recipe API");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Connect to MongoDB
const connection = mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB..." + connectionString);
  })
  .catch((err) => console.error("Could not connect to MongoDB...", err));

module.exports = connection;
