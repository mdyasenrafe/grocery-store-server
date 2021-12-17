const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5iwe9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("grocery-store");
    const productsCollection = database.collection("products");
    const AddToCartCollection = database.collection("cart");

    // product get api
    app.get("/products", async (req, res) => {
      const cursors = productsCollection.find();
      const data = await cursors.toArray();
      res.send({ data });
    });
    // product post api
    app.post("/products", async (req, res) => {
      const body = req.body;
      const result = await productsCollection.insertOne(body);
      res.json(result);
    });
    // cart get api
    app.get("/cart", async (req, res) => {
      const cursors = AddToCartCollection.find();
      const data = await cursors.toArray();
      res.send({ data });
    });
    // cart post api
    app.post("/cart", async (req, res) => {
      const body = req.body;
      const result = await AddToCartCollection.insertOne(body);
      res.json(result);
    });
    // cart put api
    app.put("/cart/:id", async (req, res) => {
      const quantity = req.body.quantity;
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: quantity,
        },
      };
      const result = await AddToCartCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.json(result);
    });
    // cart delete api
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await AddToCartCollection.deleteOne(query);
      res.json(result);
    });
    console.log("database connect");
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("<h1>This is Groccy Store server</h1>");
});

app.listen(port, () => {
  console.log("sucessfully run by", port);
});
