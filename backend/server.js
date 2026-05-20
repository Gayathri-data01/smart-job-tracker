const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

/* ---------------- DATABASE ---------------- */
db.run(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT,
    role TEXT,
    status TEXT
  )
`);

/* ---------------- TEST ROUTE ---------------- */
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Working 🚀" });
});

/* ---------------- GET JOBS ---------------- */
app.get("/api/jobs", (req, res) => {
  db.all("SELECT * FROM jobs", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

/* ---------------- ADD JOB ---------------- */
app.post("/api/jobs", (req, res) => {
  console.log("BODY:", req.body);

  const { company, role, status } = req.body;

  if (!company || !role) {
    return res.status(400).json({
      message: "Company and Role required"
    });
  }

  db.run(
    `INSERT INTO jobs (company, role, status) VALUES (?, ?, ?)`,
    [company, role, status || "pending"],
    function (err) {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: this.lastID,
        company,
        role,
        status: status || "pending"
      });
    }
  );
});

/* ---------------- DELETE JOB ---------------- */
app.delete("/api/jobs/:id", (req, res) => {
  db.run(
    "DELETE FROM jobs WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Deleted successfully" });
    }
  );
});

/* ---------------- FRONTEND (MUST BE LAST) ---------------- */
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/build", "index.html")
  );
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});