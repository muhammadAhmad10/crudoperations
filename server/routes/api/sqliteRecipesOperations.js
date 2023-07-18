const express = require("express");
const db = require("../../sqliteConnection.js");

const router = express.Router();

console.log("into operatiosn files");

// Get all recipes
router.get("/", (req, res, next) => {
  var sql = "select * from recipes";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Get a recipe by id
router.get("/:id", async (req, res) => {
  var query = `select * from recipes where id=?`;
  const userId = [parseInt(req.params.id)];
  db.get(query, userId, function (err, row) {
    if (err) {
      console.error(err.message);
    } else {
      res.json(row);
      console.log(row); // Retrieved record
    }
  });

  db.close();
});

//Post a recipe
router.post("/", (req, res) => {
  var insert =
    "INSERT INTO recipes (title,ingredients,servings,instructions,category) VALUES (?,?,?,?,?)";
  const values = [
    req.body.title,
    req.body.ingredients,
    req.body.servings,
    req.body.instructions,
    req.body.category,
  ];

  db.run(insert, values, (err) => {
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log("data inserted successfully!");
    }
  });
});

//Edit a recipe
router.put("/:id", (req, res) => {
  const updateQuery = `update from recipes set title=${req.body.title},ingredients=${req.body.ingredients},servings=${req.body.servings},instructions=${req.body.instructions},category=${req.body.category}`;
  db.run(updateQuery, (err, row) => {
    if (err) {
      console.log("got error while updating data: ", err);
    } else {
      res.json(row);
    }
  });
});

//Delete a recipe
router.delete("/:id", async (req, res) => {
  const deleteQuery = "delete from recipes where id=?";
  const values = [req.params.id];
  db.run(deleteQuery, values, (err, row) => {
    if (err) {
      console.log("Could not delete recipe.");
    } else {
      res.json("Recipe deleted successfully");
    }
  });
});

module.exports = router;
