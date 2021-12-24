import express from "express";
import { createUser, login } from "../controllers/users.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", login);

export default router;
