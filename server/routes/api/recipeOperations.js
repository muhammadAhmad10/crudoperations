const express = require("express");
const router = express.Router();
const Recipe = require("../../models/recipe");

// Get all recipes
router.get("/", async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

console.log("mongodb route handler file");

//Get recipe by id
router.get("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe)
    return res.status(404).send("The recipe with the given ID was not found.");
  res.json(recipe);
});

//Post a recipe
router.post("/", async (req, res) => {
  const recipe = req.body;
  try {
    const newRecipe = new Recipe(recipe);
    const savedRecipe = await newRecipe.save();
    res.json({ message: "New Recipt Added Successfully!", savedRecipe });
  } catch (error) {
    res, send(error);
  }
});

//edit a recipe
router.put("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  try {
    recipe.title = req.body.title;
    recipe.ingredients = req.body.ingredients;
    recipe.instructions = req.body.instructions;
    recipe.servings = req.body.servings;
    recipe.category = req.body.category;

    const newRecipe = await recipe.save();
  } catch (err) {
    res.send(err);
  }
});

//delete a recipe
router.delete("/:id", async (req, res) => {
  try {
    let deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe)
      return res.status(500).send(`Couldnt delete
    ${req.params.id} `);
    console.log("Deleted successfully");
    res.json({ Message: "Successfully Deleted" });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
