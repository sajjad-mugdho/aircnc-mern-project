const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 8000

// middlewares
app.use(cors())
app.use(express.json())

// Database Connection


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2psefg9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
  try {
    const homesCollection = client.db('aircncdb').collection('homes')
    const userCollection = client.db('aircncdb').collection('users')
    const bookingsCollection = client.db('aircncdb').collection('bookings')


    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user
      };

      const result = await userCollection.updateOne(filter, updateDoc, options);

      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1d"
      });

     // Get a single user by email
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }

      const user = await userCollection.findOne(query)
      console.log(user.role)
      res.send(user)
    })


      // Save a booking
      app.post('/bookings', async (req, res) => {
        const bookingData = req.body
        const result = await bookingsCollection.insertOne(bookingData)
        
        res.send(result)
      })

      // Get All Bookings

      app.get('/bookings', async (req, res) => {
        let query = {};
        const email = req.query.email;
        if (email) {
          query = {
            guestEmail: email
          }
        }
        const bookings = await bookingsCollection.find(query).toArray();

        res.send(bookings)
      })

      res.send({ result, token })
      
    })
    console.log('Database Connected...')
  } finally {
  }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('Server is running...')
})

app.listen(port, () => {
  console.log(`Server is running...on ${port}`)
})
