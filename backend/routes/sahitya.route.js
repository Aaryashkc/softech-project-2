import express from "express";
import {
    createSahitya,
    getAllSahitya,
    getSahityaById,
    updateSahitya,
    deleteSahitya,
} from "../controllers/sahitya.controller.js";

const router = express.Router();

router.post("/", createSahitya);
router.get("/", getAllSahitya);
router.get("/:id", getSahityaById);
router.put("/:id", updateSahitya);
router.delete("/:id", deleteSahitya);

export default router;
