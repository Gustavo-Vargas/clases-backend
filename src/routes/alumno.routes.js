import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
	getAlumnos,
	createAlumno,
	getAlumnoById,
	deleteAlumno,
	updateAlumno,
} from "../controllers/alumnos.controller.js";

// Importar el middleware de validartorSchema
import { validateSchema } from "../middlewares/validator.middleware.js";

// Importamos los esquemas de validacion
import { alumnoSchema } from "../schemas//alumno.schemas.js";

const router = Router();

// Obtener todas las clases
router.get("/alumnos", authRequired, getAlumnos);

// Agregar una clase
router.post(
	"/alumnos",
	authRequired,
	validateSchema(alumnoSchema),
	createAlumno
);

// Obtener una clase por id
router.get("/alumnos/:id", authRequired, getAlumnoById);

// Eliminar una clase
router.delete("/alumnos/:id", authRequired, deleteAlumno);

// Actualizar una clase
router.put(
	"/alumnos/:id",
	authRequired,
	validateSchema(alumnoSchema),
	updateAlumno
);

export default router;
