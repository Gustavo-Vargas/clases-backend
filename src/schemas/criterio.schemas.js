import { z } from "zod";

export const criterioSchema = z.object({
	nombre: z.string({
		required_error: "El nombre del criterio es requerido",
	}),
    porcentaje: z.number({
		required_error: "El porcentaje del criterio es requerido",
	}),
});
