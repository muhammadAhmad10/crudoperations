// routes/favoriteRoutes.js
const express = require("express");
const router = express.Router();
const Favorite = require("../../models/favorites");

// Get all favorites
router.get("/", async (req, res) => {
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
  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;

  try {
    // Fetch paginated data from the database
    const recipes = await Favorite.findOne({ user: userEmail })
      .populate("recipes")
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage);

    // Get the total count of recipes for pagination
    const totalCount = await Favorite.countDocuments({
      user: userEmail,
    }).populate("recipes");

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    res.json({
      data: recipes,
      totalPages,
    });
  } catch (error) {
    console.log("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
  // try {
  //   const favorite = await Favorite.findOne({ user: userEmail }).populate(
  //     "recipes"
  //   );
  //   res.json(favorite);
  // } catch (err) {
  //   res.status(500).json({ message: "Error fetching favorites", error: err });
  // }
});

// Add a recipe to favorites for a specific user
router.post("/:userEmail", async (req, res) => {
  const userEmail = req.params.userEmail;
  const recipeId = req.body.id;

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
router.delete("/:userEmail", async (req, res) => {
  const userEmail = req.params.userEmail;
  const recipeId = req.body.recipeId;

  try {
    let favorite = await Favorite.findOne({ user: userEmail });
    if (!favorite) {
      res.status(404).json({ message: "Favorite not found" });
      return;
    }
    favorite.recipes = favorite.recipes.filter(
      (recipe) => recipe._id.toString() !== recipeId.toString()
    );
    await favorite.save();

    res.json({ message: "Recipe removed from favorites" });
  } catch (err) {
    console.log("error deleting recipe from the favorite");
    res
      .status(500)
      .json({ message: "Error removing recipe from favorites", error: err });
  }
});

module.exports = router;
