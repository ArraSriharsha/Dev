import express from "express";
import { runCode } from "../controllers/runController.js";
import { submitCode } from "../controllers/submitController.js";
const router = express.Router();

router.post("/run", runCode);
router.post("/submit", submitCode);
export default router;