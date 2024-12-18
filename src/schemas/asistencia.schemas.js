import { z } from "zod";

export const asistenciaSchema = z.object({
	fecha: z.string({
		required_error: "Fecha requerida",
	}),
	estado: z.string({
		required_error: "Estado del alumno es requerido",
	}),
});
