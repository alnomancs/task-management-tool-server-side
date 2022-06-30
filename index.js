const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Task management tool");
});

app.listen(port, () => {
  console.log(`Task mangagement tool running on port ${port}`);
});