import { z } from "zod";

export const claseSchema = z.object({
	nombre: z.string({
		required_error: "Nombre de la clase es requerido",
	}),
	descripcion: z.string().optional(),
	fecha_inicio: z.string({
		required_error: "Fecha de inicio requerida",
	}),
	fecha_fin: z.string({
		required_error: "Fecha de fin requerida",
	}),
	hora_inicio: z.string({
		required_error: "Hora de inicio requerida",
	}),
	hora_fin: z.string({
		required_error: "Hora de fin requerida",
	}),
	dias: z.array(
		z.string({
			required_error: "Días de la clase requeridos",
		})
	),
});
