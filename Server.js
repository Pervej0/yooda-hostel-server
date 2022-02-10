const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjbgh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    const database = client.db("Yooda_Hostel");
    const foodListCollection = database.collection("foodList");
    const studentListCollection = database.collection("studentList");
    const serveListCollection = database.collection("serveList");

    // insert a food item
    app.post("/foodlist", async (req, res) => {
      const data = req.body;
      const result = await foodListCollection.insertOne(data);
      res.json(result);
    });

    // get all foods
    app.get("/foodlist", async (req, res) => {
      const cursor = foodListCollection.find({});
      const page = req.query.currentPage;
      const size = parseInt(req.query.perPageItem);
      let products;
      const count = await cursor.count();
      if (page) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send({
        count,
        products,
      });
    });

    // update a food item
    app.put("/foodlist/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = { $set: data };
      const result = await foodListCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // Delete a food item
    app.delete("/foodlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await foodListCollection.deleteOne(query);
      res.json(result);
    });

    // insert a student
    app.post("/studentlist", async (req, res) => {
      const data = req.body;
      const result = await studentListCollection.insertOne(data);
      res.json(result);
    });

    // get all students
    app.get("/studentlist", async (req, res) => {
      const cursor = studentListCollection.find({});
      const page = req.query.currentPage;
      const size = parseInt(req.query.perPageItem);

      let products;
      const count = await cursor.count();
      if (page) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send({
        count,
        products,
      });
    });

    // update a student details
    app.put("/studentlist/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = { $set: data };
      const result = await studentListCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // Delete a student details
    app.delete("/studentlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentListCollection.deleteOne(query);
      res.json(result);
    });

    // get student details by roll
    app.get("/studentlist/:extra", async (req, res) => {
      const paramsData = req.params.extra;
      const checkType = req.query.type;
      let filter = {};

      if (checkType.length === 8) {
        filter.shift = paramsData;
      }
      if (checkType.length === 6) {
        filter.roll = paramsData;
      }
      if (checkType.length === 11) {
        filter.date = paramsData;
      }
      const data = await studentListCollection.find(filter).toArray();
      res.send(data);
    });

    // insert to servelist
    app.put("/studentlist/servelist/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = { $set: data };
      const result = await studentListCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // client.close();
  }
};
run().catch(console.dir());

app.get("/", (req, res) => {
  res.send("Hello world! Welcome to server!");
});

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
