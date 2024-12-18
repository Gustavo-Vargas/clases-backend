import { z } from "zod";

export const calif_activSchema = z.array(
  z.object({
    clase: z.string({
      required_error: "ID de la clase es requerido",
    }),
    alumno: z.string({
      required_error: "ID del alumno es requerido",
    }),
    actividad: z.string({
      required_error: "ID de la actividad es requerido",
    }),
    nota: z
      .number({
        required_error: "Nota de la actividad es requerida",
      })
      .int()
      .min(0)
      .max(100),
  })
);
