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
    const usersCollection = database.collection("users");
    const AddToCartCollection = database.collection("cart");
    const OrdersCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");

    // product get api
    app.get("/products", async (req, res) => {
      const cursors = productsCollection.find();
      const data = await cursors.toArray();
      res.send({ data });
    });
    // product post api
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
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
      console.log(req.params.id);
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await AddToCartCollection.deleteOne(query);
      res.json(result);
    });
    // cart delete api
    app.delete("/carts/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await AddToCartCollection.deleteMany(query);
      res.json(result);
    });

    // orders get api
    app.get("/orders", async (req, res) => {
      const cursors = OrdersCollection.find();
      const data = await cursors.toArray();
      res.send({ data });
    });
    // orders post api
    app.post("/orders", async (req, res) => {
      const body = req.body;
      const result = await OrdersCollection.insertOne(body);
      res.json(result);
    });
    // my orders update
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const newData = req.body;
      const updateDoc = {
        $set: {
          status: newData.status,
        },
      };
      const result = await OrdersCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.json(result);
    });
    // reviews get method
    app.get("/reviews", async (req, res) => {
      const cursors = reviewCollection.find();
      const result = await cursors.toArray();
      res.send(result);
    });
    // reviews get method
    app.post("/reviews", async (req, res) => {
      const body = req.body;
      const result = await reviewCollection.insertOne(body);
      res.json(result);
    });
    console.log("database connect");
    // users get method
    app.get("/users", async (req, res) => {
      const cursors = usersCollection.find();
      const result = await cursors.toArray();
      res.send(result);
    });
    // user collection post method
    app.post("/users", async (req, res) => {
      const body = req.body;
      const result = await usersCollection.insertOne(body);
      res.json(result);
    });
    // users update and google sign in
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // find users Admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      } else {
        isAdmin = false;
      }
      res.send({ admin: isAdmin });
    });
    // get admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: user.role,
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.json(result);
    });
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
