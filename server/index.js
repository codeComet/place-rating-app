import express from "express";
import mongoose from "mongoose";
import pinRoutes from "./routes/pins.js";
import userRoutes from "./routes/users.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
dotenv.config();
app.use(cors());
app.use("/pins", pinRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: ", err.message);
  });
