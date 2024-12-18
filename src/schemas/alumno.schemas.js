import { z } from "zod";

export const alumnoSchema = z.object({
	nombre: z.string({
		required_error: "Nombre del alumno es requerido",
	}),
	apellido: z.string({
		required_error: "Apellido del alumno es requerido",
	}),
	matricula: z.number({
		required_error: "Matricula del alumno es requerido",
	}),
});
