const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// console.log("hello",process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h8pz7ag.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const picturesCollection = client.db('Gallery').collection('pictures');
        

        app.get('/pictures', async (req, res) => {
            const query = {}
            const result = await picturesCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/picture', async (req, res) => {
            const user = req.body;
            const result = await picturesCollection.insertOne(user);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.log);

app.get('/', (req, res)=>{
    res.send("Server is running");
});

app.listen(port, ()=>{
    console.log(`Port is ${port}`)
})