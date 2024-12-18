import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv'

// Importamos las rutas para usuarios
import authRoutes from "./routes/auth.routes.js";
// Importamos las rutas para las clases
import clasesRoutes from "./routes/clase.routes.js";
// Importamos las rutas para las membresia
import membresiaRoutes from "./routes/membresia.routes.js";
// Importamos las rutas para las alumno
import alumnoRoutes from "./routes/alumno.routes.js";
// Importamos las rutas para las parcial
import parcialRoutes from "./routes/parcial.routes.js";
// Importamos las rutas para los criterios
import criterioRoutes from "./routes/criterio.routes.js";
// Importamos las rutas para las actividades
import actividadRoutes from "./routes/actividad.routes.js";
// Importamos las rutas para las asistencias
import asistenciaRoutes from "./routes/asistencia.routes.js";
// Importamos las rutas para las calificaciones de actividades
import calif_activRoutes from "./routes/calif_activ.routes.js";
// Importamos las rutas para las calificaciones de parcial
import calif_parcialRoutes from "./routes/calif_parcial.routes.js";

const app = express();

dotenv.config();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Indicamos que el servidor utilice el objeto authRoutes
app.use("/api/", authRoutes);
app.use("/api/", clasesRoutes);
app.use("/api/", membresiaRoutes);
app.use("/api/", alumnoRoutes);
app.use("/api/", parcialRoutes);
app.use("/api/", criterioRoutes);
app.use("/api/", actividadRoutes);
app.use("/api/", asistenciaRoutes);
app.use("/api/", calif_activRoutes);
app.use("/api/", calif_parcialRoutes);

export default app;
