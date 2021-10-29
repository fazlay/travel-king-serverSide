const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//middle

app.use(cors());
app.use(express.json());

//DB config
const uri =
  'mongodb+srv://tkadmin:kgr4N2ewgteVd8pW@cluster0.a4iwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to database');
    //creating database collection  and document
    const database = client.db('travelKing');
    const packageCollection = database.collection('packages');
    const orderCollection = database.collection('order');

    //Get Request-------------------------
    app.get('/packages', async (req, res) => {
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });

    //Get Single Request-------------------------
    app.get('/packages/:id', async (req, res) => {

      const id = req.params.id;
     
      const query = { _id: ObjectId(id) };
      
      const dBsinglePackage = await packageCollection.findOne(query);
      console.log(dBsinglePackage);
      res.json(dBsinglePackage);
    });

    //post order in order collection
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    //particular user orders
    app.post('/orders/user', async (req, res) => {
      const userEmail = req.body;
      const query = { email: { $in: userEmail } };
      const userOrders = await orderCollection.find(query).toArray();
      res.json(userOrders);
    });

    //All orders
    app.get('/allorders', async (req, res) => {
      const cursor = orderCollection.find({});
      const allOrders = await cursor.toArray();
      res.send(allOrders);
    });

  } finally {
  }
}
run().catch(console.dir);

//testing the home route
app.get('/', (req, res) => {
  res.send('Hello from the server home route');
});
app.listen(port, (req, res) => {
  console.log('Running the Port', port);
});

//tkadmin
//kgr4N2ewgteVd8pW
