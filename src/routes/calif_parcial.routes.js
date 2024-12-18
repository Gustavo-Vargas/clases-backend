import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
	getCalif_Parcial,
	createCalif_Parcial,
	getCalif_ParcialById,
	deleteCalif_Parcial,
	updateCalif_Parcial,
} from "../controllers/calif_parcial.controller.js";

// Importar el middleware de validartorSchema
import { validateSchema } from "../middlewares/validator.middleware.js";

// Importamos los esquemas de validacion
import { calif_parcialSchema } from "../schemas/calif_parcial.schemas.js";

const router = Router();

// Obtener todas las clases
router.get("/calif_parcial", authRequired, getCalif_Parcial);

// Agregar una clase
router.post(
	"/calif_parcial",
	authRequired,
	validateSchema(calif_parcialSchema),
	createCalif_Parcial
);

// Obtener una clase por id
router.get("/calif_parcial/:id", authRequired, getCalif_ParcialById);

// Eliminar una clase
router.delete("/calif_parcial/:id", authRequired, deleteCalif_Parcial);

// Actualizar una clase
router.put(
	"/calif_parcial/:id",
	authRequired,
	validateSchema(calif_parcialSchema),
	updateCalif_Parcial
);

export default router;
