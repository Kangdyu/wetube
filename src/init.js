import dotenv from "dotenv";
import "./db";
import "./models/Video";
import "./models/Comment";
import "./models/User";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

const listenHandler = () => {
  console.log(`Listening on: http://localhost:${PORT}`);
};

app.listen(PORT, listenHandler);
