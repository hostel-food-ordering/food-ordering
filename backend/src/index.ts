import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import router from "./routes/index_route";

mongoose
  .connect(process.env.MONGO_DB as string)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log(error));

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use("/api", router);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
