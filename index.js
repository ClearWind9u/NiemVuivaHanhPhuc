import express from "express"
import mongoose, { mongo } from "mongoose"
import dotenv from "dotenv"


const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

const connectToDatabaseAndStartServer = async () => {
    try {
        await mongoose.connect(MONGOURL);
        console.log("Database is connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

connectToDatabaseAndStartServer();

const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const UserModel = mongoose.model("users", userSchema)



app.get("/getUsers", async(req, res) => {
    const userData = await UserModel.find();
    res.json(userData);
} )