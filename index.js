const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());





async function run() {
    try {
        const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.qo03dll.mongodb.net/?appName=Cluster1`

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
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


        // DELETE multiple pictures by an array of IDs
        app.delete('/pictures', async (req, res) => {
            try {

                const ids = req.body.ids;

                if (!Array.isArray(ids) || ids.length === 0) {
                    return res.status(400).send({ message: "IDs must be a non-empty array" });
                }

                // Validate IDs
                const objectIds = [];
                for (const id of ids) {
                    if (!ObjectId.isValid(id)) {
                        return res.status(400).send({ message: `Invalid ObjectId: ${id}` });
                    }
                    objectIds.push(new ObjectId(id));
                }

                const result = await picturesCollection.deleteMany({
                    _id: { $in: objectIds },
                });

                res.send({
                    message: "Deleted successfully",
                    deletedCount: result.deletedCount,
                });
            } catch (error) {
                console.error("DELETE ERROR:", error);
                res.status(500).send({
                    message: "Failed to delete pictures.........",
                    error: error.message,
                });
            }
        });


    }
    finally {

    }
}
run().catch(console.log);

app.get('/', (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log(`Port is ${port}`)
})