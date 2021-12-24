import express from "express";
import { createPin, getPin } from "../controllers/pins.js";

const router = express.Router();

//create a pin
router.post("/", createPin);

//getpins
router.get("/", getPin);

export default router;
