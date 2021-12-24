import mongoose from "mongoose";
import PinModel from "../models/Pins.js";

//create a pin
export const createPin = async (req, res) => {
  const body = req.body;
  const newPin = new PinModel(body);

  try {
    await newPin.save();
    res.status(201).json(newPin);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

//getpins

export const getPin = async (req, res) => {
  try {
    const pins = await PinModel.find();
    res.status(200).json(pins);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
