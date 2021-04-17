const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 8000;

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.id4k2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
app.get('/', (req, res) => {
  res.send('Hello World!')
})

client.connect(err => {
    //console.log("error",err)
  const serviceCollection = client.db("interiordb").collection("services");
  
  //load data from database
  app.get('/services', (req, res) => {
    serviceCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
 })
 
  // post to database
 app.post('/addServices', (req, res) => {
   const newService = req.body;
   //console.log("new service",newService)
   serviceCollection.insertOne(newService)
   .then(result =>{
     console.log('inserted count', result.insertedCount)
     res.send(result.insertedCount > 0)
   })
 })


});
client.connect(err => {
  //console.log("error",err)
  const reviewCollection = client.db("interiordb").collection("reviews");
  //load review data from database
 app.get('/reviews', (req, res) => {
  reviewCollection.find()
  .toArray((err, documents) => {
    res.send(documents);
  })
})

 //post review to database
 app.post('/addReviews', (req, res) => {
  const newReview = req.body;
  console.log("new review added",newReview)
  reviewCollection.insertOne(newReview)
  .then(result =>{
    console.log('inserted count', result.insertedCount)
    res.send(result.insertedCount > 0)
  })
})

});


app.listen(PORT, () => {
  console.log(`Example app listening ${PORT}`)
})