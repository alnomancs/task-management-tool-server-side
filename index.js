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

    //task edit
    app.post("/task/edit", async (req, res) => {
      const id = req.query._id;
      const task = req.query.task;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          task: task,
        },
      };

      const result = await tasksCollections.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    //task complete
    app.post("/task", async (req, res) => {
      const id = req.query._id;
      const status = req.query.status;

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

      res.send(result);
    });

    app.get("/tasks", async (req, res) => {
      const query = { status: "0" };

      const tasks = await tasksCollections.find(query).toArray();

      res.send(tasks);
    });
    app.get("/tasksComplete", async (req, res) => {
      const query = { status: "1" };

      const tasks = await tasksCollections.find(query).toArray();

      res.send(tasks);
    });

    //insert task
    app.post("/addTask", async (req, res) => {
      const task = req.body;

      const result = await tasksCollections.insertOne(task);
      res.send(result);
    });
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
