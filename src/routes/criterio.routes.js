import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
	getCriterios,
	createCriterio,
	getCriterioById,
	deleteCriterio,
	updateCriterio,
} from "../controllers/criterio.controller.js";

// Importar el middleware de validartorSchema
import { validateSchema } from "../middlewares/validator.middleware.js";

// Importamos los esquemas de validacion
import { criterioSchema } from "../schemas/criterio.schemas.js";

const router = Router();

// Obtener todas los parciales
router.get("/criterio", authRequired, getCriterios);

// Agregar un parcial
router.post(
	"/criterio",
	authRequired,
	validateSchema(criterioSchema),
	createCriterio
);

// Obtener un parcial por id
router.get("/criterio/:id", authRequired, getCriterioById);

// Eliminar un parcial
router.delete("/criterio/:id", authRequired, deleteCriterio);

// Actualizar un parcial
router.put(
	"/criterio/:id",
	authRequired,
	validateSchema(criterioSchema),
	updateCriterio
);

export default router;
