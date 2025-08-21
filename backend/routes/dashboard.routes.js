import express from "express";
import {getpersonsByProfession, getpersonsByMonth, getpersonsByAgeRange} from "../controller/dashboard.controller.js";

const router = express.Router();

/*Endpoints para el dashboard*/
router.get("/profession", getpersonsByProfession);
router.get("/age-range", getpersonsByAgeRange);
router.get("/month", getpersonsByMonth);

export default router;