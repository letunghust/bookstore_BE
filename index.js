const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const port = process.env.PORT || 3001;
require('dotenv').config();

const route = require('./src/routes/index');

// cho phep ket noi den database 
app.use(cors());
app.use(express.json())

const corsOptions = {
  origin: true, 
  credentials: true 
};
app.use(cors(corsOptions));

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.DB_URI ;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
    route(app);


// mongoose.set("strictQuery", false)
// mongoose.connect(`${uri}/BookInventory`)
mongoose.connect(uri, { dbName: "BookInventory" })
.then(() => {
    console.log('Connected to mongoDB')
    app.listen(port, () => {
      console.log(`App listening on port ${port}`)
  })
}).catch((error) => {
  console.log(error)
})

// console.log(process.env.PORT)
// console.log(process.env.EMAIL_NAME)
// console.log(process.env.EMAIL_APP_PASSWORD)
// console.log(process.env.JWT_SECRET)
// console.log(process.env.STRIPE_SECRET_KEY)

// 123123