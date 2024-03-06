const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello world!')
})

// 9QtEWA38Yiu9MkS6

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://hoangphikiemkhach:9QtEWA38Yiu9MkS6@book-store.xwsw6kc.mongodb.net/?retryWrites=true&w=majority&appName=book-store";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const bookCollection = client.db("BookInventory").collection("books");

    // get all book 
    // app.get("/all-books", async(req, res) => {
    //   const books = bookCollection.find();
    //   const result = await books.toArray();
    //   res.send(result);
    // })

    // insert a book
    app.post("/upload-book", async(req, res) => {
      const data = req.body;
      const result = await bookCollection.insertOne(data);
      res.send(result);     
  })

    //update a book 
    app.patch("/book/:id", async(req, res) => {
      const id = req.params.id; 
      const updateBookData = req.body;
      const filter = {_id: new ObjectId(id)};
      const updateDoc = {
        $set: {
          ...updateBookData
        },
      }
      const options = {upsert: true};
      const result = await bookCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    // delete a book
    app.delete("/book/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await bookCollection.deleteOne(filter);
      res.send(result);
    })

    // find by category 
    app.get("/all-books", async(req, res) => {
      let query = {};
      if(req.query?.category) {
        query = {category: req.query.category}
      }
      const result = await bookCollection.find(query).toArray();
      res.send(result);
    })

    // get single book data
    app.get("/book/:id", async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)};
      const result = await bookCollection.findOne(filter);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

