import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
	getActividades,
	createActividad,
	getActividadById,
	deleteActividad,
	updateActividad,
} from "../controllers/actividad.controller.js";

// Importar el middleware de validartorSchema
import { validateSchema } from "../middlewares/validator.middleware.js";

// Importamos los esquemas de validacion
import { actividadSchema } from "../schemas/actividad.schemas.js";

const router = Router();

// Obtener todas las clases
router.get("/actividades", authRequired, getActividades);

// Agregar una clase
router.post(
	"/actividades",
	authRequired,
	validateSchema(actividadSchema),
	createActividad
);

// Obtener una clase por id
router.get("/actividades/:id", authRequired, getActividadById);

// Eliminar una clase
router.delete("/actividades/:id", authRequired, deleteActividad);

// Actualizar una clase
router.put(
	"/actividades/:id",
	authRequired,
	validateSchema(actividadSchema),
	updateActividad
);

export default router;
