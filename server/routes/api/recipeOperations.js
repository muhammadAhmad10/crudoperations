const express = require("express");
const router = express.Router();
const Recipe = require("../../models/recipe");

const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "web-dev-acccd.appspot.com",
});

const bucket = admin.storage().bucket();
const upload = multer({ storage: multer.memoryStorage() });

// Get all recipes
router.get("/", async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;

  try {
    // Fetch paginated data from the database
    const recipes = await Recipe.find()
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage);

    // Get the total count of recipes for pagination
    const totalCount = await Recipe.countDocuments();

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    res.json({
      data: recipes,
      totalPages,
    });
  } catch (error) {
    console.log("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }

  // const recipes = await Recipe.find();
  // res.json(recipes);
});

//Get recipes of loged user
router.get("/:userEmail", async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;

  try {
    // Fetch paginated data from the database
    const recipes = await Recipe.find({ author: req.params.userEmail })
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage);

    // Get the total count of recipes for pagination
    const totalCount = await Recipe.countDocuments({
      author: req.params.userEmail,
    });

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    res.json({
      data: recipes,
      totalPages,
    });
  } catch (error) {
    console.log("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }

  // const recipes = await Recipe.find();
  // res.json(recipes);
});

//Get recipe by id
router.get("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe)
    return res.status(404).send("The recipe with the given ID was not found.");
  res.json(recipe);
});

//Get recipe by name
router.get("/search/:recipeTitle", async (req, res) => {
  const recipe = await Recipe.find({
    title: { $regex: req.params.recipeTitle.toLowerCase(), $options: "i" },
  });
  // console.log("search result is: ", recipe);
  if (recipe.length === 0) {
    return res.status(468).send("No recipe found!");
  }
  if (!recipe)
    return res
      .status(404)
      .send("The recipe with the given title was not found.");
  res.json(recipe);
});

//Post a recipe
router.post("/", upload.single("image"), async (req, res) => {
  const { title, ingredients, servings, category, instructions, author } =
    req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded");
  }
  const filename = Date.now() + "_" + file.originalname;
  const filepath = `recipes/${filename}`;

  const isAlreadyUploaded = await Recipe.findOne({
    title: { $regex: new RegExp(`^${title}$`, "i") },
    author: author,
  });
  if (!isAlreadyUploaded) {
    const bucketFile = bucket.file(filepath);

    const stream = bucketFile.createWriteStream({
      resumable: false,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: Date.now(),
        },
      },
    });

    stream.on("finish", async () => {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(filepath)}?alt=media&token=${
        bucketFile.metadata.metadata.firebaseStorageDownloadTokens
      }`;

      const [filesInStorageBucket] = await bucket.getFiles();
      for (const file of filesInStorageBucket) {
        if (file == imageUrl) {
          console.log("deleting old book: ", file);
        }
      }
      if (imageUrl) {
        if (
          title &&
          ingredients &&
          instructions &&
          servings &&
          category &&
          author &&
          imageUrl
        ) {
          const newRecipe = new Recipe({
            title: title,
            ingredients: ingredients,
            instructions: instructions,
            servings: servings,
            image: imageUrl,
            category: category,
            author: author,
          });

          try {
            const savedBook = await newRecipe.save();
            res.status(200).send("recipe posted successfully.");
          } catch (error) {
            console.error("Error saving recipe:", error);
            res.status(500).send("Error saving recipe");
          }
        } else {
          console.log("Some field value is missing.");
          res.status(300).send("Some field value is missing.");
        }
      } else {
        res.status(700).send("There is problem with Uploading image.");
      }
    });
    stream.end(file.buffer);
  } else {
    res.status(460).send("You have already shared recipe with this title!");
    console.log("item already exist");
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
    const filename = deletedRecipe.image;

    function getPathStorageFromUrl(url) {
      const baseUrl =
        "https://firebasestorage.googleapis.com/v0/b/web-dev-acccd.appspot.com/o/";
      let imagePath = url.replace(baseUrl, "");
      const indexOfEndPath = imagePath.indexOf("?");
      imagePath = imagePath.substring(0, indexOfEndPath);
      imagePath = imagePath.replace("%2F", "/");
      return imagePath;
    }

    const storage = admin.storage();
    const imagePath = getPathStorageFromUrl(filename);
    storage
      .bucket()
      .file(imagePath)
      .delete()
      .catch((err) => console.error(err));
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
