import express from "express";
import { createNote, getNotes, updateNote } from "../Controller/noteController.js";

const router = express.Router();


router.post("/notes",createNote );
router.get("/notes/:id", getNotes);
router.put("/notes/:id",updateNote );
export default router;
