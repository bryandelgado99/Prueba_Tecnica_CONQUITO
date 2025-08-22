import express from "express";
import { createPerson, getPersons, getPersonById, updatePerson, deletePerson} from "../controller/form.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/*Endpoints para el formulario*/
router.post("/create", createPerson);
router.put("/:id", updatePerson);
router.get("/all", getPersons);
router.get("/:id", getPersonById);
router.delete("/:id", deletePerson);

export default router;