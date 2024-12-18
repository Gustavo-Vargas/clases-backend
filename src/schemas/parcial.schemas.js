import { z } from "zod";

export const parcialSchema = z.object({
	nombre: z.string({
		required_error: "El nombre del parcial es requerido",
	}),
});
