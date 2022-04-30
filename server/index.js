import express from "express";
import mongoose from "mongoose";
import pinRoutes from "./routes/pins.js";
import userRoutes from "./routes/users.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/pins", pinRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("welcome to pin it");
});

mongoose
  .connect(
    "mongodb+srv://bishal:Bishal10@cluster0.aeufx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: ", err.message);
  });
