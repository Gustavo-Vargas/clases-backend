import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
	getCalif_Activ,
	createCalif_Activ,
	// getCalif_ActivById,
	// deleteCalif_Activf,
	updateCalif_Activ,
} from "../controllers/calif_activ.controller.js";

// Importar el middleware de validartorSchema
import { validateSchema } from "../middlewares/validator.middleware.js";

// Importamos los esquemas de validacion
import { calif_activSchema } from "../schemas/calif_activ.schemas.js";

const router = Router();

// Obtener todas las clases
router.get("/calif_activ", authRequired, getCalif_Activ);

// Agregar una clase
router.post(
	"/calif_activ",
	authRequired,
	validateSchema(calif_activSchema),
	createCalif_Activ
);

// Obtener una clase por id
// router.get("/calif_activ/:id", authRequired, getCalif_ActivById);

// Eliminar una clase
// router.delete("/calif_activ/:id", authRequired, deleteCalif_Activf);

// Actualizar una clase
// router.put(
// 	"/calif_activ/:id",
// 	authRequired,
// 	validateSchema(calif_activSchema),
// 	updateCalif_Activ
// );

// Actualizar lista de calificaciones
router.put(
	"/calif_activ",
	authRequired,
	// validateSchema(calif_activSchema),
	updateCalif_Activ
);

export default router;
