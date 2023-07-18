var express = require("express");
var app = express();

app.use("/api/recipe", require("./routes/api/sqliteRecipesOperations.js"));

// Start server
var port = 8000;
app.listen(port, () => {
  console.log("Server running on port: ", port);
});

app.get("/recipe", async (req, res) => {});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
