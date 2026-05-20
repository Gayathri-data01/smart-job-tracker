const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.log("DB connection error:", err.message);
  } else {
    console.log("SQLite connected");
  }
});

module.exports = db;