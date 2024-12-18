import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
	getAsistencias,
	createAsistencia,
	getAsistenciaById,
	deleteAsistencia,
	updateAsistencia,
	getDiasAsistencia,
} from "../controllers/asistencia.controller.js";

// Importar el middleware de validartorSchema
import { validateSchema } from "../middlewares/validator.middleware.js";

// Importamos los esquemas de validacion
import { asistenciaSchema } from "../schemas/asistencia.schemas.js";

const router = Router();

// Obtener todas las clases
router.get("/asistencia", authRequired, getAsistencias);

// Agregar una clase
router.post(
	"/asistencia",
	authRequired,
	validateSchema(asistenciaSchema),
	createAsistencia
);

// Obtener una clase por id
router.get("/asistencia/:id", authRequired, getAsistenciaById);

// Eliminar una clase
router.delete("/asistencia/:id", authRequired, deleteAsistencia);

// Actualizar una clase
router.put(
	"/asistencia/:id",
	authRequired,
	validateSchema(asistenciaSchema),
	updateAsistencia
);

// Obtener una lista de los dias de asistencia
router.get("/asistencias/dias", authRequired, getDiasAsistencia);

export default router;
