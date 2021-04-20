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
  const adminCollection = client.db("interiordb").collection("admins");
  const orderCollection = client.db("interiordb").collection("orders");
 
  //load data from service database
  app.get('/services', (req, res) => {
    serviceCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
 })
 //load data from admin database
 app.get('/admin', (req, res) => {
  adminCollection.find({})
  .toArray((err, documents) => {
    res.send(documents);
  })
})
app.get('/admin', (req, res) => {
  console.log(req.query.email)
  adminCollection.find({email:req.query.email})
  .toArray((err, documents) => {
    console.log(documents)
    res.send(documents);
  })
})

//load data from "order" database
app.get('/order', (req, res) => {
  orderCollection.find({})
  .toArray((err, documents) => {
    res.send(documents);
  })
})
 
  // post to "services" database
 app.post('/addServices', (req, res) => {
   const newService = req.body;
   //console.log("new service",newService)
   serviceCollection.insertOne(newService)
   .then(result =>{
     console.log('inserted count', result.insertedCount)
     //res.send(result.insertedCount > 0)
    res.redirect('/addServices')
   })
 })

 //post to "admin" database
 app.post('/addAdmin', (req, res) => {
  const newAdmin = req.body;
  //console.log("new service",newService)
  adminCollection.insertOne(newAdmin)
  .then(result =>{
    console.log('inserted count', result.insertedCount)
    res.send(result.insertedCount > 0)
   // res.redirect('/addServices')
  })
})

//post to "orders" database
app.post('/addOrders',(req,res)=>{
  const newOrder = req.body;
  orderCollection.insertOne(newOrder)
  .then(result =>{
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
})

// delete from "services" database
app.delete('/delete/:id', (req, res) => {
  //console.log(req.params.id);
  serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then(result => {
   res.send(result.deletedCount >0)
   //res.redirect('/delete/:id');
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