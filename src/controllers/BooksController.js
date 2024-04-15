const Books = require("../models/Books");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cloudinary = require("../utils/cloudinary.config");
const upload = require("../utils/multer.config");

class BooksController {
  // [GET] home
  index(req, res) {
    res.send("Hello world!");
  }

  // [POST] create a book
//   create(req, res) {
//     console.log('Recerved a request to create a book')

//     upload.any()(req, res, async (err) => {
//       if (err) {
//         console.log('Error uploading file: ', err)
//         return res.status(400).send("Error uploading file");
//       }

//       const file = req.files[0];
//       const data = req.body;

//       console.log('request body: ', data)
//       if (!file) {
//         console.log('No file uploaded');
//         return res.status(400).send("No file uploaded");
//       }

//       try {
//         // Upload ảnh lên Cloudinary
//         console.log('Uploading image to cloudinary ...')
//         const uploadResponse = await cloudinary.uploader.upload(file.path, {
//           upload_preset: "ml_default",
//         });

//         const imageURL = uploadResponse.secure_url;
//         console.log('image uploaded to cloudinary, url: ', imageURL);

//         // Tạo đối tượng Book mới với đường dẫn ảnh từ Cloudinary
//         const newBook = new Books({
//           bookTitle: data.bookTitle,
//           authorName: data.authorName,
//           imageURL: imageURL,
//           category: data.category,
//           bookDescription: data.bookDescription,
//           bookPDFURL: data.bookPDFURL,
//           price: data.price,
//         });

//         console.log('saving new book to database...')
//         // Lưu đối tượng Book mới vào cơ sở dữ liệu
//         const result = await newBook.save();
//         console.log('book saved successfully: ', result); 
//         res.send(result);
//       } catch (error) {
//         res.status(500).send("Error creating the book");
//         console.error(error);
//       }
//     });
//   }
async create(req, res) {
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result)
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
      res.status(500).send('Error creating the book');
    }
  }

  // [GET] find by category
  findByCategory(req, res) {
    let query = {};
    if (req.query?.category) {
      query = { category: req.query.category };
    }

    // Sử dụng phương thức find của model Books
    Books.find(query)
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
