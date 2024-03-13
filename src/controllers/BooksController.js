const Books = require('../models/Books');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

class BooksController {
    // [GET] home 
    index(req, res) {
        res.send('Hello world!')
    }

    // [POST] create a book 
    create(req, res) {
        const data = req.body;
        Books.create(data)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send('Error creating the book');
            console.error(error);
        });
    }

     // [GET] find by category 
     findByCategory(req, res) {
        let query = {};
        if (req.query?.category) {
            query = { category: req.query.category };
        }

        // Sử dụng phương thức find của model Books
        Books.find(query)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send('Error finding books by category');
                console.error(error);
            });
    }

     // [GET] find by ID 
     findById(req, res) {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };

        // Sử dụng phương thức findOne của model Books
        Books.findOne(filter)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send('Error finding book by ID');
                console.error(error);
            });
    }

     // [PATCH] update by ID
     updateById(req, res) {
        const id = req.params.id;
        const updateBookData = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: {
                ...updateBookData
            },
        };
        const options = { upsert: true };

        // Sử dụng phương thức updateOne của model Books
        Books.updateOne(filter, updateDoc, options)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send('Error updating book by ID');
                console.error(error);
            });
    }

    // [DELETE] delete by ID
    deleteById(req, res) {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };

        // Sử dụng phương thức deleteOne của model Books
        Books.deleteOne(filter)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send('Error deleting book by ID');
                console.error(error);
            });
    }
}

module.exports = new BooksController