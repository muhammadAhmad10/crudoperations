var express = require("express");
var app = express();
var cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/recipes", require("./routes/api/sqliteRecipesOperations.js"));

// Start server
var port = 8000;
app.listen(port, () => {
  console.log("Server running on port: ", port);
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
