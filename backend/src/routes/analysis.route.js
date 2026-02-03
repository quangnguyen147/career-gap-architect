import { Router } from "express";
import multer from "multer";
import validate from "../middlewares/validate.middleware.js";
import { analyze } from "../controllers/analysis.controller.js";


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post("/analyze", upload.fields([
{ name: "resumeFile", maxCount: 1 },
{ name: "jdFile", maxCount: 1 }
]), validate, analyze);


export default router;
