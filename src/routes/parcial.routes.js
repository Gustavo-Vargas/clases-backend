import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
	getParciales,
	createParcial,
	getParcialById,
	deleteParcial,
	updateParcial,
} from "../controllers/parcial.controller.js";

// Importar el middleware de validartorSchema
import { validateSchema } from "../middlewares/validator.middleware.js";

// Importamos los esquemas de validacion
import { parcialSchema } from "../schemas/parcial.schemas.js";

const router = Router();

// Obtener todas los parciales
router.get("/parcial", authRequired, getParciales);

// Agregar un parcial
router.post("/parcial", authRequired, validateSchema(parcialSchema), createParcial);

// Obtener un parcial por id
router.get("/parcial/:id", authRequired, getParcialById);

// Eliminar un parcial
router.delete("/parcial/:id", authRequired, deleteParcial);

// Actualizar un parcial
router.put(
	"/parcial/:id",
	authRequired,
	validateSchema(parcialSchema),
	updateParcial
);

export default router;
