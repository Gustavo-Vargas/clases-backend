import { z } from "zod";

export const membresiaSchema = z.object({
	fecha_inicio: z.string({
		required_error: "Es requerida la Fecha de Inicio",
	}),
	fecha_expiracion: z.string({
		required_error: "Es requerida la Fecha de Fin",
	}),
	estado: z.string({
		required_error: "Estado es requerido",
	}),
});
