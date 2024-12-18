import { z } from "zod";

export const calif_parcialSchema = z.object({
	_id: z.string({
		required_error: "El id del parcial es requerido",
	}),
	nombre: z.string({
		required_error: "El nombre del parcial es requerido",
	}),
});
