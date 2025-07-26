import express from "express";

import db from "../db/connection.js"; // Adjust the import path as necessary

import { ObjectId } from "mongodb";

const router = express.Router();
// grabs all posts from the database
router.get("/", async (req, res) => {
    // grabs the posts collection from the database
    let collection = await db.collection("posts");
    let posts = await collection.find({}).toArray();
    res.send(posts).status(200);
});

router.get("/:id", async (req, res) => {
    let collection = await db.collection("posts");
    let query = { _id: new ObjectId(req.params.id) };
    let post = await collection.findOne(query);

    if (!post) {
        return res.status(404).send("Post not found");
    } else {
        return res.send(post).status(200);
    }
});

router.post("/", async (req, res) => {
    try{
        let newPost = {
            username: req.body.username,
            text: req.body.text,
            date: new Date(),
        }
        let collection = await db.collection("posts");
        let result = await collection.insertOne(newPost);
        res.send(result).status(201);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.patch("/:id", async (req, res) => {
    try{
        const query = { _id: new ObjectId(req.params.id) };
        const update = {
            $set: {
                text: req.body.text,
                date: new Date(),
            },
        };
        let collection = await db.collection("posts");
        let result = await collection.updateOne(query, update);
        res.send(result).status(200);
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete("/:id", async (req, res) => {
    try{
        const query = { _id: new ObjectId(req.params.id) };
        let collection = await db.collection("posts");
        let result = await collection.deleteOne(query);
        res.send(result).status(200);
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;