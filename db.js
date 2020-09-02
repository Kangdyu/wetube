import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL, 
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;

const openHandler = () => {
  console.log("connected to DB");
}

const errorHandler = (error) => {
  console.log(`Error on DB Connection: ${error}`);
}

db.once("open", openHandler);
db.on("error", errorHandler);