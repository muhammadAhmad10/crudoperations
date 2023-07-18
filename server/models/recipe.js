const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  ingredients: String,
  instructions: String,
  servings: String,
  // image: String,
  category: String,
});

const Recipe = mongoose.model("recipes", schema);

module.exports = Recipe;
