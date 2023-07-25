const express = require("express");
const db = require("../../sqliteConnection.js");

const router = express.Router();
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
router.get("/", (req, res, next) => {
  const { page, limit } = req.query;

  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const offset = (pageNumber - 1) * itemsPerPage;

  try {
    const query = `SELECT * FROM recipes LIMIT ? OFFSET ?`;
    db.all(query, [itemsPerPage, offset], (err, recipes) => {
      if (err) {
        console.log("Error fetching data:", err);
        return res.status(500).json({ message: "Error fetching data" });
      }

      const totalCountQuery = `SELECT COUNT(*) as count FROM recipes`;
      db.get(totalCountQuery, [], (err, row) => {
        if (err) {
          console.log("Error fetching total count:", err);
          return res.status(500).json({ message: "Error fetching data" });
        }

        const totalCount = row.count;
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        res.json({
          data: recipes,
          totalPages,
        });
      });
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error fetching data" });
  }

  // var sql = "select * from recipes";
  // var params = [];
  // db.all(sql, params, (err, rows) => {
  //   if (err) {
  //     res.status(400).json({ error: err.message });
  //     return;
  //   }
  //   res.json({
  //     message: "success",
  //     data: rows,
  //   });
  // });
});

//Get the recipes of loged user
router.get("/:userEmail", (req, res, next) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const offset = (pageNumber - 1) * itemsPerPage;

  try {
    const query = `SELECT * FROM recipes WHERE author = ? LIMIT ? OFFSET ?`;
    db.all(
      query,
      [req.params.userEmail, itemsPerPage, offset],
      (err, recipes) => {
        if (err) {
          console.log("Error fetching data:", err);
          return res.status(500).json({ message: "Error fetching data" });
        }

        const totalCountQuery = `SELECT COUNT(*) as count FROM recipes WHERE author = ?`;
        db.get(totalCountQuery, [req.params.userEmail], (err, row) => {
          if (err) {
            console.log("Error fetching total count:", err);
            return res.status(500).json({ message: "Error fetching data" });
          }

          const totalCount = row.count;
          const totalPages = Math.ceil(totalCount / itemsPerPage);

          res.json({
            data: recipes,
            totalPages,
          });
        });
      }
    );
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
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
router.post("/", upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  const filename = Date.now() + "_" + file.originalname;
  const filepath = `books/${filename}`;

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

    var insert =
      "INSERT INTO recipes (title,ingredients,servings,instructions,category,image,author) VALUES (?,?,?,?,?,?,?)";
    const values = [
      req.body.title,
      req.body.ingredients,
      req.body.servings,
      req.body.instructions,
      req.body.category,
      imageUrl,
      req.body.author,
    ];

    db.run(insert, values, (err) => {
      if (err) {
        console.log("Error: ", err);
      } else {
        console.log("data inserted successfully!");
      }
    });
  });

  stream.end(file.buffer);
  // var insert =
  //   "INSERT INTO recipes (title,ingredients,servings,instructions,category,image,author) VALUES (?,?,?,?,?,?,?)";
  // const values = [
  //   req.body.title,
  //   req.body.ingredients,
  //   req.body.servings,
  //   req.body.instructions,
  //   req.body.category,
  //   req.body.image,
  //   req.body.author,
  // ];

  // db.run(insert, values, (err) => {
  //   if (err) {
  //     console.log("Error: ", err);
  //   } else {
  //     console.log("data inserted successfully!");
  //   }
  // });
});

//Edit a recipe
router.put("/:id", (req, res) => {
  const updateQuery = `update recipes set title=?,ingredients=?,servings=?,instructions=?,category=? where _id=?`;
  const values = [
    req.body.title,
    req.body.ingredients,
    req.body.servings,
    req.body.instructions,
    req.body.category,
    req.params.id,
  ];
  db.run(updateQuery, values, (err, row) => {
    if (err) {
      console.log("got error while updating data: ", err);
    } else {
      res.json(row);
    }
  });
});

//Delete a recipe
router.delete("/:id", async (req, res) => {
  const deleteQuery = "delete from recipes where _id=?";
  const values = [req.params.id];
  db.run(deleteQuery, values, (err, row) => {
    if (err) {
      console.log("Could not delete recipe.");
    } else {
      console.log("Recipe deleted successfully");
    }
  });
});

module.exports = router;
