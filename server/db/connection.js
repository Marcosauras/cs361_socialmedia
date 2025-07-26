import { MongoClient, ServerApiVersion  } from "mongodb";

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
} catch (error) {
    console.log("Connected to MongoDB Atlas", error);
}

let db = client.db("Users");

export default db;