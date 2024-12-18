import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
	getMembresias,
	createMembresias,
	getMembresiaById,
	deleteMembresias,
	updateMembresias,
} from "../controllers/membresia.controller.js";

// Importar el middleware de validartorSchema
import { validateSchema } from "../middlewares/validator.middleware.js";

// Importamos los esquemas de validacion
import { membresiaSchema } from "../schemas/membresia.schemas.js";

const router = Router();

// Obtener todas las membresias
router.get("/membresia", authRequired, getMembresias);

// Agregar una membresia
router.post(
	"/membresia",
	authRequired,
	// validateSchema(membresiaSchema),
	createMembresias
);

// Obtener una membresia por id
router.get("/membresia/:id", authRequired, getMembresiaById);

// Eliminar una membresia
router.delete("/membresia/:id", authRequired, deleteMembresias);

// Actualizar una membresia
router.put(
	"/membresia/:id",
	authRequired,
	validateSchema(membresiaSchema),
	updateMembresias
);

export default router;
