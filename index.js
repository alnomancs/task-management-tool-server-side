const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5005;

app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://admin:admin@cluster0.yf4we.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const tasksDb = client.db("task-management").collection("tasks");

    app.get("/tasks", async (req, res) => {
      const tasks = await tasksDb.find().toArray();
      res.send(tasks);
    });

    //insert reviews
    app.post("/addTask", async (req, res) => {
      const task = req.body;
      const result = await tasksDb.insertOne(task);
      console.log(result);
      res.send(result);
    });

    // // create a document to insert
    // const doc = {
    //   title: "Record of a Shriveled Datum",
    //   content: "No bytes, no problem. Just insert a document, in MongoDB",
    // };
    // const result = await database.insertOne(doc);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
  }
}

run().catch(console.dir);

//root api
app.get("/", (req, res) => {
  res.send("Task Management tools");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
