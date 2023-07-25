// var sqlite3 = require("sqlite3").verbose();
// const DBSOURCE = "./database.db";

// let db = new sqlite3.Database(DBSOURCE, (err) => {
//   if (err) {
//     // Cannot open database
//     console.error("Unable to open database: ", err.message);
//     throw err;
//   } else {
//     console.log("Connected to the SQLite database.");
//     //Create a table or if already created then insert some initial data
//     // db.run("drop table recipes");

//     db.run(
//       `CREATE TABLE recipes (
//             _id INTEGER PRIMARY KEY AUTOINCREMENT,
//             title text,
//             ingredients text,
//             servings text,
//             instructions text,
//             category text,
//             image text,
//             author text,
//             )`,
//       (err) => {
//         if (err) {
//           console.log("Table already created.");
//         } else {
//           var insert =
//             "INSERT INTO recipes (title,ingredients,servings,instructions,category,image,author) VALUES (?,?,?,?,?,?,?)";
//           db.run(insert, [
//             "Tea",
//             "1 cup water, 1.5 cup milk, 1 tbs tea powder, 1.5 tbs sugar",
//             "2 servings",
//             "boil the water by pouring sugar and tea powder and then add milk and boil then tea is ready.",
//             "drinks",
//             "https://firebasestorage.googleapis.com/v0/b/web-dev-acccd.appspot.com/o/recipes%2Ftea.jpeg?alt=media&token=37f5fe63-b441-459e-b437-9778e1857de2",
//             "mahmdras21@gmail.com",
//           ]);
//         }
//       }
//     );
//     var insert =
//       "INSERT INTO recipes (title,ingredients,servings,instructions,category,image,author) VALUES (?,?,?,?,?,?,?)";
//     db.run(insert, [
//       "Tea",
//       "1 cup water, 1.5 cup milk, 1 tbs tea powder, 1.5 tbs sugar",
//       "2 servings",
//       "boil the water by pouring sugar and tea powder and then add milk and boil then tea is ready.",
//       "drinks",
//       "https://firebasestorage.googleapis.com/v0/b/web-dev-acccd.appspot.com/o/recipes%2Ftea.jpeg?alt=media&token=37f5fe63-b441-459e-b437-9778e1857de2",
//       "mahmdras21@gmail.com",
//     ]);
//   }
// });

// module.exports = db;

const sqlite3 = require("sqlite3").verbose();
const database = "./database.db";

const db = new sqlite3.Database(database, async (err) => {
  if (err) {
    console.error("Unable to open database: ", err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");

    try {
      await createTable();
      // await insertData();
    } catch (err) {
      console.log("Error occurred: ", err);
    }
  }
});

function createTable() {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS recipes (
        _id INTEGER PRIMARY KEY AUTOINCREMENT,
        title text,
        ingredients text,
        servings text,
        instructions text,
        category text,
        image text,
        author text
      )`,
      (err) => {
        if (err) {
          console.log("Error creating table: ", err);
          reject(err);
        } else {
          console.log("Table created successfully.");
          resolve();
        }
      }
    );
  });
}

function insertData() {
  return new Promise((resolve, reject) => {
    const insert =
      "INSERT INTO recipes (title, ingredients, servings, instructions, category, image, author) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.run(
      insert,
      [
        "Tea",
        "1 cup water, 1.5 cup milk, 1 tbs tea powder, 1.5 tbs sugar",
        "2 servings",
        "boil the water by pouring sugar and tea powder and then add milk and boil then tea is ready.",
        "drinks",
        "https://firebasestorage.googleapis.com/v0/b/web-dev-acccd.appspot.com/o/recipes%2Ftea.jpeg?alt=media&token=37f5fe63-b441-459e-b437-9778e1857de2",
        "mahmdras21@gmail.com",
      ],
      (err) => {
        if (err) {
          console.log("Error inserting data: ", err);
          reject(err);
        } else {
          console.log("Data inserted successfully.");
          resolve();
        }
      }
    );
  });
}

module.exports = db;
