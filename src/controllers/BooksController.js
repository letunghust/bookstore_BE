const Books = require("../models/Books");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cloudinary = require("../utils/cloudinary.config");
const upload = require("../utils/multer.config");
const { paginate } = require("mongoose-paginate-v2");

class BooksController {
  // [GET] home
  index(req, res) {
    res.send("Hello world!");
  }

  // [POST] create a book
  async create(req, res) {
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      // console.log(result)
      // Create new book
      const newBook = new Books({
        bookTitle: req.body.bookTitle,
        authorName: req.body.authorName,
        imageURL: result.secure_url,
        category: req.body.category,
        bookDescription: req.body.bookDescription,
        bookPDFURL: req.body.bookPDFURL,
        price: req.body.price,
      });

      // Save the new book to the database
      const savedBook = await newBook.save();

      // Return the saved book data as the response
      res.json(savedBook);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error creating the book");
    }
  }

  // [GET] get total books by category
  getTotalBooksByCategory(req, res) {
    Books.aggregate([
      {$group: {_id: "$category", total: {$sum: 1}}},
    ])
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send("Error getting total books by category");
        console.log(error);
      });
  }

  // [GET] find by category and paginate
  findByCategory(req, res) {
    let query = {};
    const { page = 1, limit = 20 } = req.query;

    if (req.query?.category) {
      query = { category: req.query.category };
    }

    // Sử dụng paginate() để phân trang kết quả
    Books.paginate(query, { page, limit })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send("Error finding books by category");
        console.error(error);
      });
  }

  // [GET] find by ID
  findById(req, res) {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };

    // Sử dụng phương thức findOne của model Books
    Books.findOne(filter)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send("Error finding book by ID");
        console.error(error);
      });
  }

  // [GET] find by title
  findByTitle(req, res) {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json("Please provide a search term");
    }

    const regex = new RegExp(searchTerm, "i"); // khong phân biệt chữ hoa, chữ thường.

    // Books.find({bookTitle: {$regex: regex}})
    Books.find({
      bookTitle: { $regex: regex },
      // $or: [
      //   { bookTitle: { $regex: regex } },
      //   { bookDescription: { $regex: regex } },
      // ],
    })
      .then((books) => {
        res.json(books);
      })
      .catch((error) => {
        res.status(500).json("Error finding books by title");
        console.log(error);
      });
  }

  // [PATCH] update by ID
  updateById(req, res) {
    const id = req.params.id;
    const updateBookData = req.body;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        ...updateBookData,
      },
    };
    const options = { upsert: true };

    // Sử dụng phương thức updateOne của model Books
    Books.updateOne(filter, updateDoc, options)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send("Error updating book by ID");
        console.error(error);
      });
  }

  // [PATCH] update quantity by id 
  updateQuantityById(req, res) {
    const id = req.params.id;
    const {quantity} = req.body;

    const filter = {_id: new ObjectId(id)};
    const updateDoc = {$set: {quantity}};
    const options = {upsert: true};

    Books.updateOne(filter, updateDoc, options)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send('Error updating book quantity');
        console.log(error); 
      })
  }

  // [DELETE] delete by ID
  deleteById(req, res) {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };

    // Sử dụng phương thức deleteOne của model Books
    Books.deleteOne(filter)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send("Error deleting book by ID");
        console.error(error);
      });
  }
}

module.exports = new BooksController();
