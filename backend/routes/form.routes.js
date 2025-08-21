import express from "express";
import { createPerson, getPersons, getPersonById, updatePerson, deletePerson} from "../controller/form.controller.js";

const router = express.Router();

/*Endpoints para el formulario*/
router.post("/create", createPerson);
router.put("/:id", updatePerson);
router.get("/all", getPersons);
router.get("/:id", getPersonById);
router.delete("/:id", deletePerson);

export default router;