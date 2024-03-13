const BooksController = require('../controllers/BooksController')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const Books = require('../models/Books');
const UserControllers = require('../controllers/UserController')

function route(app) {
    app.get('/', BooksController.index);

    // find by category 
    app.get("/all-books", BooksController.findByCategory)
    // get a book 
    app.get("/book/:id", BooksController.findById)
    app.post("/upload-book", BooksController.create )
    app.patch("/book/:id", BooksController.updateById)
    app.delete("/book/:id", BooksController.deleteById)

    app.get("/all-uses",  async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })

    app.get("user/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
    // Sign up 
    app.post("/signup", UserControllers.signup)
    // Login
    app.post("/login", async (req, res) => {
        const { email, password } = req.body;
    
        try {
            const user = await User.findOne({ email });
    
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
    
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
    
            // Điều này chỉ là một ví dụ, bạn có thể thực hiện xác thực và phát mã thông báo JWT ở đây.
    
            res.json({ message: 'Login successful' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })

   
}

module.exports = route;