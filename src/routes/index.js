function route(app, bookCollection) {
    app.get('/', (req, res) => {
        res.send('Hello world!')
    });

    // post a book
    app.post("/upload-book", async(req, res) => {
        const data = req.body;
        const result = await bookCollection.insertOne(data);
        res.send(result);     
    });

    // app.patch("/book/:id", async(req, res) => {
    //     const id = req.params.id; 
    //     const updateBookData = req.body;
    //     const filter = {_id: new ObjectId(id)};
    //     const updateDoc = {
    //       $set: {
    //         ...updateBookData
    //       },
    //     }
    //     const options = {upsert: true};
    //     const result = await bookCollection.updateOne(filter, updateDoc, options);
    //     res.send(result);
    //   })

    // find by category 
    app.get("/all-books", async(req, res) => {
        let query = {};
        if(req.query?.category) {
          query = {category: req.query.category}
        }
        const result = await bookCollection.find(query).toArray();
        res.send(result);
    })

    // app.get("/book/:id", async(req, res) => {
    //     const id = req.params.id;
    //     const filter = { _id: new ObjectId(id)};
    //     const result = await bookCollection.findOne(filter);
    //     res.send(result);
    // })
}

module.exports = route;