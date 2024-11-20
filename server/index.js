import express from "express"
import mongoose, { mongo } from "mongoose"
import dotenv from "dotenv"
import cors from "cors";
import Orders from "./routes/order.js";


dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;


const app = express();
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindandModify: false
  })
  .catch((error) => console.log(error));

app.use("/", Orders);



app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
