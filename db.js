const mongoose = require("mongoose");
const db = async () => {
    try {
       
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connectted")
    } catch (error) {
        console.log("DB connection Error" , error)
    }
} 

module.exports = { db }