const express = require("express");
const mysql = require("./db/mysql");
const routes = require("./routes/index");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mysql.connect();

app.use("/api", routes);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

// Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Closing database connection...");
  mysql.end((err) => {
    if (err) {
      console.error("Error closing the database connection:", err.stack);
    }
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  });
});
