const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express()
const port = process.env.PORT || 5000;





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cknzz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// MIDDLEWARE part
app.use(cors());
app.use(express.json())

// console.log(uri)




client.connect(err => {
    const carsDataCollection = client.db("carsData").collection("carsDetails");
    const orderCollection = client.db("carsData").collection("orderedProduct");
    const reviewCollection = client.db("carsData").collection("reviews");
    const usersCollection = client.db("carsData").collection("users");

    // ADD  POST CARS DATA
    app.post("/addServices", async (req, res) => {
        const result = await carsDataCollection.insertOne(req.body)
        res.send(result);
    })

    // GET ALL CARS DADA
    app.get("/cars", async (req, res) => {
        const result = await carsDataCollection.find({}).toArray();
        res.send(result);
    })


    // GET SINGLE CARS DATAa
    app.get("/singleProduct/:id", async (req, res) => {
        // console.log(req.params.id)
        const result = await carsDataCollection.find({ _id: ObjectId(req.params.id) }).toArray();
        res.send(result[0]);
    })


    // CONFIRM ORDER
    app.post("/confirmOrder", async (req, res) => {
        const result = await orderCollection.insertOne(req.body);
        res.send(result);
    })



    // GET MY CONFIRM ORDER
    app.get("/myOrders/:email", async (req, res) => {
        // console.log(req.params.id)
        const result = await orderCollection.find({ email: req.params.email }).toArray();
        res.send(result);
    })



    // get all confirmed order
    app.get("/confirmedOrders", async (req, res) => {
        // console.log(req.params.id)
        const result = await orderCollection.find({}).toArray();
        res.send(result);
    })


    // REVIES OF CLIENT
    app.post("/reviews", async (req, res) => {
        const result = await reviewCollection.insertOne(req.body)
        res.send(result);
    })

    // get review
    app.get("/allReviews", async (req, res) => {
        const result = await reviewCollection.find({}).toArray();
        res.send(result);
    })


    // DELETE ORDER
    app.delete("/deleteOrder/:id", async (req, res) => {
        const result = await orderCollection.deleteOne({
            _id: ObjectId(req.params.id),
        })
        res.send(result);
    })

    app.delete("/deletePd/:id", async (req, res) => {
        const result = await carsDataCollection.deleteOne({
            _id: ObjectId(req.params.id),
        })
        res.send(result);
    })


    // save user info

    app.post("/addUserInfo", async (req, res) => {
        console.log("req.body");
        const result = await usersCollection.insertOne(req.body);
        // res.send(result);
        res.send(result);
    });




    //  make admin
    app.put("/makeAdmin", async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        console.log('put', user)
        const updateDoc = { $set: { role: 'admin' } };
        const result = await usersCollection.updateOne(filter, updateDoc)
        res.json(result);
    });


    // check admin or not
    app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin });
    })



    // check admin or not
    app.get("/checkAdmin/:email", async (req, res) => {
        const result = await usersCollection
            .find({ email: req.params.email })
            .toArray();
        console.log(result);
        res.send(result);
    });



    // *********
    // perform actions on the collection object
    //   client.close();
});


app.get('/', (req, res) => {
    res.send('Allah code run korao...amin!....and it is working');
})


// MynulIslam

// 4bzah7ygCJFNwojo











app.listen(port, () => {
    console.log('Running server at', port)
})