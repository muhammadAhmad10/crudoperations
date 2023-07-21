const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  user: String, // Store user email as the identifier
  recipes: [{ type: Schema.Types.ObjectId, ref: "recipes" }], // Array of recipe references
});

const Favorite = mongoose.model("favorite", favoriteSchema);
module.exports = Favorite;
