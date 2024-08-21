const express = require("express");
const app = express();
const PORT = 5050;
require("dotenv").config()
const cors = require("cors");
const { db } = require("./db")
console.log(db)
const mongoose = require("mongoose")

app.use(cors({
    origin: "*"
}));
app.use(express.json());

// schema
const userSchema = new mongoose.Schema({
    username: String,
    option: String,
    bike: String,
    startTime: Date,
    stopTime: Date,
});

const User = mongoose.model('User', userSchema);

// handle login
app.post('/', async (req, res) => {
    const { username, option } = req.body;
    try {
        const newUser = new User({ username, option });
        await newUser.save();
        res.status(200).json({ message: "User data saved successfully", data: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error saving user data", error });
    }
});
// handle select 
app.post('/saveBikeSelection', async (req, res) => {
    const { username, bike } = req.body;
    if (!username || !bike) {
        return res.status(400).json({ message: "Username and bike are required" });
    }
    try {
        const newUser = new User({
            username,
            bike,
            startTime: new Date()
        });
        await newUser.save();
        res.status(200).json({ message: "Bike selection saved successfully", data: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error saving bike selection", error });
    }
});

app.post('/stopBikeSelection', async (req, res) => {
    const { username, bike } = req.body;

    if (!username || !bike) {
        return res.status(400).json({ message: "Username and bike are required" });
    }

    try {
        const updateResult = await User.findOneAndUpdate(
            { username, bike, stopTime: { $exists: false } },
            { stopTime: new Date() },
            { new: true }
        );

        res.status(200).json({ message: "Bike selection stopped successfully", data: updateResult });
    } catch (error) {
        res.status(500).json({ message: "Error stopping bike selection", error });
    }
});
app.get('/getBikeSelections', async (req, res) => {
    try {
        const selections = await User.find({});
        res.status(200).json(selections);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bike selections", error });
    }
});

db()
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// data from the input should save in database that i have connected