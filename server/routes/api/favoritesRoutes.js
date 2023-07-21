// routes/favoriteRoutes.js
const express = require("express");
const router = express.Router();
const Favorite = require("../../models/favorites");

console.log("favorites handler file");
// Get all favorites
router.get("/", async (req, res) => {
  console.log("getting favorites");
  try {
    const favorites = await Favorite.find().populate("recipes");
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Error fetching favorites", error: err });
  }
});

// Get favorites for a specific user
router.get("/:userEmail", async (req, res) => {
  const userEmail = req.params.userEmail;
  try {
    const favorite = await Favorite.findOne({ user: userEmail }).populate(
      "recipes"
    );
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ message: "Error fetching favorites", error: err });
  }
});

// Add a recipe to favorites for a specific user
router.post("/:userEmail", async (req, res) => {
  console.log("into favorite post route");
  const userEmail = req.params.userEmail;
  const recipeId = req.body.id;
  console.log(userEmail, recipeId);

  try {
    let favorite = await Favorite.findOne({ user: userEmail });
    if (!favorite) {
      favorite = new Favorite({ user: userEmail, recipes: [] });
    }
    favorite.recipes.push(recipeId);
    await favorite.save();
    res.json({ message: "Recipe added to favorites" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding recipe to favorites", error: err });
  }
});

//Delete a favourite
router.delete("/:userEmail/:recipeId", async (req, res) => {
  const userEmail = req.params.userEmail;
  const recipeId = req.params.recipeId;
  console.log("deleting", userEmail, "and ", recipeId);
  try {
    let favorite = await Favorite.findOne({ user: userEmail });
    if (!favorite) {
      res.status(404).json({ message: "Favorite not found" });
      return;
    }
    favorite.recipes = favorite.recipes.filter((id) => id !== recipeId);
    await favorite.save();
    res.json({ message: "Recipe removed from favorites" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing recipe from favorites", error: err });
  }
});

module.exports = router;
