const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 4000;

// use middleware
app.use(cors());
app.use(express.json());

// user: dbuser1
// password: 132k7MMsRT1ENhJZ



const uri = "mongodb+srv://dbuser1:132k7MMsRT1ENhJZ@cluster0.remhw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();

        const usersCollection = client.db("foodExpress").collection("user");
        
        // get users
        app.get('/user', async(req, res) =>{
            const query = {};
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/user/:id'), async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await usersCollection.findOne(query);;
            res.send(result);
        }

        // post user: add a new user
       app.post('/user', async(req, res) =>{
           const newUser = req.body;
           console.log('adding new user', newUser);
           const result = await usersCollection.insertOne(newUser);
           res.send(result)
       });
       app.put('/user/:id', async(req, res) =>{
           const id = req.params.id;
           const updatedUser = req.body;
           const filter = {_id: ObjectId(id)}
           const options = {upsert: true };
           const updatedDoc = {
               $set: {
                   name: updatedUser.name,
                   email: updatedUser.email
               }
           };
           const result = await usersCollection.updateOne(filter, updatedDoc, options);
           res.send(result);
       })

       // delete user 
       app.delete('/user/:id', async(req, res) =>{
           const id = req.params.id;
           const query = {_id: ObjectId(id)};
           const result = await usersCollection.deleteOne(query);
           res.send(result);
       })
    }
    

    finally{
        // await client.close()
    }
}


run().catch(console.dir)


app.get('/', (req, res) =>{
    res.send('Running My Node Server. And you know what I mean')
});


app.listen(port, () =>{
    console.log('CURD Server is running');
})