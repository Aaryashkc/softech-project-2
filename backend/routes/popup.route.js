import express from "express";
import {
  createPopup,
  getPopups,
  getActivePopups,
  getPopupById,
  updatePopup,
  deletePopup,
} from "../controllers/popup.controller.js";

const router = express.Router();

router.post("/", createPopup);
router.get("/", getPopups);
router.get("/active", getActivePopups);
router.get("/:id", getPopupById);
router.put("/:id", updatePopup);
router.delete("/:id", deletePopup);

export default router;
