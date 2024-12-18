import { z } from "zod";

export const actividadSchema = z.object({
	nombre: z.string({
		required_error: "Nombre de la clase es requerido",
	}),
	descripcion: z.string().optional(),
	fecha_entrega: z.string({
		required_error: "Fecha de entrega requerida",
	}),
});
