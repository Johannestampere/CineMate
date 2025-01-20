import 'dotenv/config'

// Imports
import express from 'express';
import connect from "./db/dbConnection.js"
const port = process.env.PORT || 3001
import Friend from './models/Friend.js';
import OpenAI from "openai"
import cors from "cors"
import { Db } from 'mongodb';

// Create express app
const app = express()

// Configure express app
app.use(express.json())
app.use(cors()) // middleware


// Connect to mongoDB
try {
    connect()
    console.log(`Connected to db on port ${process.env.PORT}`)
} catch (e) {
    console.log(e)
}

// Routing

// Sample route for /
app.get("/", (req, res) => {
    res.send("Test connection to server");
});

// Route to check if the inserted name already exists
app.get("/namecheck/:name", async (req, res) => {
    const { name } = req.params

    try {
        const friend = await Friend.findOne({ name })

        if (friend) {
            return res.json({ exists: true })
        } else {
            return res.json({ exists: false })
        }
    } catch (e) {
        console.error()
        res.status(500).send("Error checking if friend exists")
    }
})

// Create new friend when pushing start button
app.post("/create-friend", async (req, res) => {
    const { name, preferences } = req.body

    try {
        const newFriend = new Friend({ name, preferences })
        await newFriend.save()
        res.status(201).json({ message: "New friend created", friend: newFriend})
    } catch (err) {
        res.status(500).json({ message: "Error creating friend", error: err });
    }
})

// Update friend preferences
app.put("/update-preferences", async (req, res) => {
    const { name, category, preference, vote } = req.body;
  
    try {
      // Find the friend document by name
      const friend = await Friend.findOne({ name });
      
      if (friend) {
        // Ensure the category exists in the preferences
        if (!friend.preferences[category]) {
          friend.preferences[category] = {};
        }
  
        // Update the specific preference
        friend.preferences[category][preference] = vote === "like" ? 2 : vote === "kindaLike" ? 1 : 0;
  
        // Use the specific field
        const updateResult = await Friend.updateOne(
          { _id: friend._id },
          { $set: { [`preferences.${category}.${preference}`]: friend.preferences[category][preference] } }
        );
  
        if (updateResult.modifiedCount > 0) {
          res.status(200).send("Preferences updated");
        } else {
          res.status(404).send("Friend not found or preferences not updated");
        }
      } else {
        res.status(404).send("Friend not found");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(500).send("Error updating preferences");
    }
});
  

// Get all friends
app.get("/friends", async (req, res) => {
    try {
        const friends = await Friend.find()
        res.json({ friends })
    } catch (err) {
        res.status(500).json({ message: "Error fetching friends", error: err });
    }
})

// Generate movie recommendation using OpenAI API
app.post("/recommendation", async (req, res) => {
    const friendsData = req.body

    // Configure Chat and prompt that we're gonna send
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

    const prompt = `These friends cannot decide on a movie to watch. Here’s some data about what they like. 2 means like, 1 means kinda like, and 0 means dislike. Give me one movie title, and ONLY the title. Data: ${JSON.stringify(friendsData)}`

    try {
        // Send prompt
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            store: true,
            messages: [
                {"role": "user", "content": prompt}
            ]
        });

        // Retrieve output
        res.json({ movieRecommendation: completion.choices[0].message})

    } catch (err) {
        console.error("Error getting movie recommendation:", err);
        res.status(500).json({ message: "Error getting movie recommendation", error: err.message });
    }

})


// Start server 
app.listen(port)