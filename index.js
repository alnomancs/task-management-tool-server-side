const express = require("express");
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  ClientSession,
  ObjectId,
} = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5005;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yf4we.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const tasksCollections = client.db("task-management").collection("tasks");

    app.post("/task", async (req, res) => {
      const id = req.query._id;
      const status = req.query.status;

      console.log(id, status);

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status,
        },
      };

      const result = await tasksCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.send(result);
    });

    app.get("/tasks", async (req, res) => {
      const query = { status: "0" };

      const tasks = await tasksCollections.find(query).toArray();

      console.log(tasks);
      res.send(tasks);
    });
    app.get("/tasksComplete", async (req, res) => {
      const query = { status: "1" };

      const tasks = await tasksCollections.find(query).toArray();

      console.log(tasks);
      res.send(tasks);
    });

    //insert reviews
    app.post("/addTask", async (req, res) => {
      const task = req.body;
      console.log(task);
      const result = await tasksCollections.insertOne(task);
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
