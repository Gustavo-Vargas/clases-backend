import Calif_Activs from "../models/calif_activ.model.js";
import Clases from "../models/clase.model.js";
import Actividades from "../models/actividad.model.js";
import Alumnos from "../models/alumno.model.js";

// Funcion para obtener todos las calificaciones de la clase
export const getCalif_Activ = async (req, res) => {
	try {
		const { clase: claseId, actividad: actividadId } = req.query;

		const claseFound = await Clases.findById(claseId);
		if (!claseFound)
			return res.status(404).json({ message: ["No se encontro la clase"] });

		// Buscar todas las calificaciones con el id de la clase y el id de la actividad
		const calificaciones = await Calif_Activs.find({
			clase: claseFound._id,
			actividad: actividadId,
		})
			.populate("alumno") // Trae la información del alumno asociado
			.populate("actividad"); // Trae la información de la actividad asociada

		res.status(200).json(calificaciones);
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ message: ["Error al obtener las calificaiones de una clase"] });
	}
};

// Función para crear calificaciones de una actividad
export const createCalif_Activ = async (req, res) => {
	try {
		const calificaciones = req.body; // req.body es un array de objetos de calificaciones

		// Validar que req.body no esté vacío
		if (
			!calificaciones ||
			!Array.isArray(calificaciones) ||
			calificaciones.length === 0
		) {
			return res
				.status(400)
				.json({ message: ["No se recibieron calificaciones"] });
		}

		// Array para almacenar las calificaciones guardadas
		const savedCalificaciones = [];

		// Iterar sobre cada calificación y guardarla
		for (const calif of calificaciones) {
			const { alumno, actividad, clase, nota } = calif;

			// Validar la existencia de clase, actividad y alumno
			const claseFound = await Clases.findById(clase);
			if (!claseFound)
				return res
					.status(404)
					.json({ message: [`Clase con ID ${clase} no encontrada`] });

			const actividadFound = await Actividades.findById(actividad);
			if (!actividadFound)
				return res
					.status(404)
					.json({ message: [`Actividad con ID ${actividad} no encontrada`] });

			const alumnoFound = await Alumnos.findById(alumno);
			if (!alumnoFound)
				return res
					.status(404)
					.json({ message: [`Alumno con ID ${alumno} no encontrado`] });

			// Crear una nueva calificación
			const newCalif = new Calif_Activs({
				nota,
				clase: claseFound._id,
				actividad: actividadFound._id,
				alumno: alumnoFound._id,
			});

			// Guardar la calificación y agregarla al array
			const savedCalif = await newCalif.save();
			savedCalificaciones.push(savedCalif);
		}

		// Responder con las calificaciones guardadas
		res.status(201).json(savedCalificaciones);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Error al crear las calificaciones",
			error: error.message,
		});
	}
};

// Función para actualizar calificaciones
export const updateCalif_Activ = async (req, res) => {
	try {
		// console.log("calificaciones", req.body);

		const calificaciones = req.body;
		const { clase: claseId, actividad: actividadId } = req.body[0];

		// console.log(calificaciones.length);
		// Validar que req.body no esté vacío
		if (
			!calificaciones ||
			!Array.isArray(calificaciones) ||
			calificaciones.length === 0
		) {
			return res
				.status(400)
				.json({ message: ["No se recibieron calificaciones"] });
		}

		const claseFound = await Clases.findById(claseId);
		if (!claseFound)
			return res.status(404).json({ message: ["No se encontró la clase"] });

		const actividadFound = await Actividades.findById(actividadId);
		if (!actividadFound)
			return res.status(404).json({ message: ["No se encontró la actividad"] });

		// Iterar por cada calificación para actualizarla
		for (const calif of calificaciones) {
			const alumnoFound = await Alumnos.findById(calif.alumno);
			if (!alumnoFound)
				return res
					.status(404)
					.json({ message: [`Alumno con ID ${calif.alumno} no encontrado`] });

			// Validar si la nota está presente y no es vacía
			const { nota } = calif;
			if (nota === undefined || nota === null || nota === "") {
				continue;
			}

			// Buscar la calificación con el id de la clase, el id de la actividad y el id del alumno
			const calificacionFound = await Calif_Activs.findOne({
				clase: claseFound._id,
				actividad: actividadId,
				alumno: alumnoFound._id,
			});

			if (calificacionFound) {
				// Si se encuentra la calificación, actualizarla
				await Calif_Activs.findByIdAndUpdate(
					calificacionFound._id,
					{ $set: { nota } },
					{ new: true } // Devuelve el documento actualizado
				);
				// console.log("Se encontró la calificación y se actualizó");
			} else {
				// Si no se encuentra la calificación, crear una nueva
				const nuevaCalificacion = new Calif_Activs({
					clase: claseFound._id,
					actividad: actividadId,
					alumno: alumnoFound._id,
					nota: nota,
				});

				// Guardar la nueva calificación en la base de datos
				await nuevaCalificacion.save();
				console.log("No se encontró la calificación, se creó una nueva");
			}
		}

		res
			.status(200)
			.json({ message: ["Calificaciones actualizadas correctamente"] });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Error al actualizar las calificaciones",
			error: error.message,
		});
	}
};
