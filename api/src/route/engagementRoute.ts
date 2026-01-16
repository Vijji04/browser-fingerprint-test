import express from "express";
import { checkFingerPrint } from "../controllers/engagement";
import { updateSlider } from "../controllers/engagement";

const router = express.Router();

router.post("/engagement-stats", checkFingerPrint);
router.post("/update-slider", updateSlider);

export default router;
