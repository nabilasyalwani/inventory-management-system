const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
