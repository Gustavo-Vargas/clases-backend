import { Router } from "express";
import {
	registerAdmin,
	login,
	register,
	logout,
	profile,
	getUsers,
	deleteUser,
	updateUser,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

// Importamos el validatorSchema
import { validateSchema } from "../middlewares/validator.middleware.js";
// Importamos los esquemas de validacion
import { registerSchema, loginSchema } from "../schemas/auth.schemas.js";

const router = Router();

// Ruta para registrar un Administrador
router.post("/registerAdmin", validateSchema(registerSchema), registerAdmin);

// Ruta para registrarse
router.post("/register", validateSchema(registerSchema), register);

//Ruta para iniciar sesión
router.post("/login", validateSchema(loginSchema), login);

// Ruta para cerar sesión
router.post("/logout", logout);

// Ruta para  el perfil del usuario
router.get("/profile", authRequired, profile);

// Ruta para OBTENER TODOS LOS USUARIOS
router.get("/users", authRequired, getUsers);

// Eliminar una clase
router.delete("/users/:id", authRequired, deleteUser);

// Actualizar una clase
router.put(
	"/users/:id",
	authRequired,
	// validateSchema(alumnoSchema),
	updateUser
);

export default router;
