import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
	getClases,
	createClase,
	getClaseById,
	deleteClase,
	updateClase,
	obtenerCalendario,
} from "../controllers/clases.controller.js";

// Importar el middleware de validartorSchema
import { validateSchema } from "../middlewares/validator.middleware.js";

// Importamos los esquemas de validacion
import { claseSchema } from "../schemas/clase.schemas.js";

const router = Router();

// Obtener todas las clases
router.get("/clases", authRequired, getClases);

// Agregar una clase
router.post("/clases", authRequired, validateSchema(claseSchema), createClase);

// Obtener una clase por id
router.get("/clases/:id", authRequired, getClaseById);

// Eliminar una clase
router.delete("/clases/:id", authRequired, deleteClase);

// Actualizar una clase
router.put(
	"/clases/:id",
	authRequired,
	validateSchema(claseSchema),
	updateClase
);

// Obtener las clases como calendario
router.get("/calendario", authRequired, obtenerCalendario);

export default router;
