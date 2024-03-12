const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()

const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.SECRECT_USER}:${process.env.SECRECT_KEY}@cluster0.gegfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//  console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");




//  database apply 

const packagesCollection =client.db('travelwp').collection('packages')
const tourGaideCollection =client.db('travelwp').collection('tourgaide')
const touristBlogsCollection =client.db('travelwp').collection('touristblogs')
const MyWishlistCollection =client.db('travelwp').collection('MyWishlist')
const bookingsCollection =client.db('travelwp').collection('booking')
const usersCollection =client.db('travelwp').collection('users')

// get items 
app.get('/packages', async(req,res)=>{
    res.send(await packagesCollection.find().toArray())
})
app.get('/tourgaide', async(req,res) =>{
    res.send(await tourGaideCollection.find().toArray())
    })
app.get('/touristblogs', async(req,res) =>{
    res.send(await touristBlogsCollection.find().toArray())
    })
app.get('/booking', async(req,res) =>{
    res.send(await bookingsCollection.find().toArray())
    })
app.get('/MyWishlist', async(req,res) =>{
    res.send(await MyWishlistCollection.find().toArray())
    })
app.get('/users', async(req,res) =>{
    res.send(await usersCollection.find().toArray())
    })

    // get multipule item 
    app.get('/MyWishlist/:email', async(req,res) =>{
      const email = req.params.email
      const query ={userEmail: email}
      // console.log(email, query)
      res.send(await MyWishlistCollection.find(query).toArray())
    })
    app.get('/booking/:email', async(req,res) =>{
      const email = req.params.email
      const query ={touristEmail: email}
      // console.log(email, query)
      res.send(await bookingsCollection.find(query).toArray())
    })
    app.get('/bookings/:guide', async(req,res) =>{
      const find = req.params.guide
      const query ={gaideName: find}
      console.log(find, query)
      res.send(await bookingsCollection.find(query).toArray())
    })

// get single item  
app.get('/packages/:id', async(req,res)=>{
    const id = req.params.id
    const find = {_id: new ObjectId(id)}
    res.send(await packagesCollection.findOne(find))
})
app.get('/tourgaide/:id', async(req,res)=>{
    const id = req.params.id
    const find = {_id: new ObjectId(id)}
    res.send(await tourGaideCollection.findOne(find))
})
app.get('/touristblogs/:id', async(req,res)=>{
    const id = req.params.id
    const find = {_id: new ObjectId(id)}
    res.send(await touristBlogsCollection.findOne(find))
})


// post  Collection 
app.post('/touristblogs', async(req,res)=>{
  const blogs = req.body;
  res.send(await touristBlogsCollection.insertOne(blogs))

})
app.post('/mywishlist', async(req,res)=>{
  const blogs = req.body;
  res.send(await MyWishlistCollection.insertOne(blogs))

})
app.post('/booking', async(req,res)=>{
  const booking = req.body;
  res.send(await bookingsCollection.insertOne(booking))

})

app.post('/users', async(req, res)=>{
  const user = req.body
  const query = {email: user.email}
  const existingUser = await usersCollection.findOne(query)
  if(existingUser){
    return res.send({message: 'user already have', insertId:null})
  }
  res.send(await usersCollection.insertOne(user))
})
  

// delete items 
app.delete('/mywishlist/:id', async(req, res)=>{
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  res.send(await MyWishlistCollection.deleteOne(query))
})

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',( req, res) =>{
  res.send('mongo is running')
})

app.listen(port, ()=>{
    console.log('database is running', port)
})