import Calif_Parciales from "../models/calif_parcial.modal.js";
import Clases from "../models/clase.model.js";
import Parciales from "../models/parcial.model.js";
import Alumnos from "../models/alumno.model.js";
import Calif_Activs from "../models/calif_activ.model.js";
import Actividades from "../models/actividad.model.js";

// Funcion para obtener todos las calificaciones del parcial
export const getCalif_Parcial = async (req, res) => {
	try {
		const claseId = req.query.clase._id;

		// Buscar todos los parciales para la clase
		const parciales = await Parciales.find({ clase: claseId });
		if (!parciales)
			return res
				.status(404)
				.json({ message: ["No se encontró los parciales"] });

		// Buscar todos los alumnos de la clase
		const alumnos = await Alumnos.find({ clase: claseId }).sort({
			matricula: 1,
		});
		if (!alumnos)
			return res
				.status(404)
				.json({ message: ["No se encontraron los alumnos"] });

		// Crear una lista de alumnos con sus calificaciones de los parciales
		const resultado = await Promise.all(
			alumnos.map(async (alumno) => {
				let calificacionesParciales = [];
				let sumaCalificaciones = 0;
				let cantidadParciales = parciales.length;

				// Obtener calificación de cada parcial para el alumno
				for (const parcial of parciales) {
					const califParcial = await Calif_Parciales.findOne({
						clase: claseId,
						parcial: parcial._id,
						alumno: alumno._id,
					});

					const nota = califParcial ? califParcial.nota : 0; // Si no hay calificación, se toma como 0

					calificacionesParciales.push({
						parcial: parcial.nombre, // Asumiendo que el parcial tiene un campo 'nombre'
						calificacion: nota,
					});

					sumaCalificaciones += nota;
				}

				// Calcular la calificación final promedio
				const promedioFinal =
					cantidadParciales > 0 ? sumaCalificaciones / cantidadParciales : 0;

				return {
					matricula: alumno.matricula,
					nombre: alumno.nombre,
					apellido: alumno.apellido,
					parciales: calificacionesParciales,
					calificacionFinal: promedioFinal.toFixed(2), // Redondear a 2 decimales
				};
			})
		);

		// Responder con la lista de alumnos y sus calificaciones
		res.json(resultado);
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ message: ["Error al obtener las calificaiones del parcial"] });
	}
};

// Funcion para crear una calificacion del parcial
export const createCalif_Parcial = async (req, res) => {
	try {
		const { _id: parcialId, clase } = req.body;

		// Buscar el id de la clase
		const claseFound = await Clases.findById(clase);
		if (!claseFound)
			return res.status(404).json({ message: ["Clase no encontrada"] });

		// Buscar el id del parcial
		const parcialFound = await Parciales.findById(parcialId);
		if (!parcialFound)
			return res.status(404).json({ message: ["Parcial no encontrado"] });

		// Buscar todos los alumnos de la clase y ordenarlos por matrícula
		const alumnos = await Alumnos.find({ clase: claseFound._id }).sort({
			matricula: 1,
		});

		const actividades = await Actividades.find({
			clase: claseFound._id,
			parcial: parcialFound._id,
		}).populate("criterio");

		// Sumar todas las ponderaciones de los criterios disponibles
		const sumaTotalPonderacion = actividades.reduce((total, actividad) => {
			return total + (actividad.criterio?.porcentaje || 0);
		}, 0);

		// Recorer los alumnos para agregar la calif del parcial
		for (const alumno of alumnos) {
			let sumaPonderacionesDisponibles = actividades.reduce(
				(total, actividad) => {
					return total + (actividad.criterio?.porcentaje || 0);
				},
				0
			);

			let sumaNotas = 0;

			// Recorremos cada actividad para obtener la calificación del alumno
			for (const actividad of actividades) {
				const calificacionFound = await Calif_Activs.findOne({
					clase: claseFound._id,
					actividad: actividad._id,
					alumno: alumno._id,
				});

				// Obtener el porcentaje del criterio
				const porcentajeCriterio = actividad.criterio?.porcentaje || 0;

				// Si hay calificación, sumar la nota ponderada, si no, se asume 0
				const nota = calificacionFound ? calificacionFound.nota : 0;
				sumaNotas += (nota * porcentajeCriterio) / 100;
			}

			// Calcular el promedio ponderado ajustado a las ponderaciones disponibles
			let promedio = 0;
			if (sumaPonderacionesDisponibles > 0) {
				promedio = sumaNotas / (sumaPonderacionesDisponibles / 100);
			}

			// Buscar si ya existe una calificación del parcial para este alumno
			let califParcial = await Calif_Parciales.findOne({
				clase: claseFound._id,
				parcial: parcialFound._id,
				alumno: alumno._id,
			});

			if (califParcial) {
				// Si existe, actualizamos la calificación del parcial
				califParcial.nota = promedio;
			} else {
				// Si no existe, creamos una nueva calificación
				califParcial = new Calif_Parciales({
					nota: promedio,
					clase: claseFound._id,
					parcial: parcialFound._id,
					alumno: alumno._id,
				});
			}
			// Guardamos la calificación del parcial
			await califParcial.save();
			console.log(
				`Calificación del parcial para el alumno ${alumno.matricula}: ${promedio}`
			);
		}
		res.json({
			message: "Calificaciones del parcial actualizadas correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al crear la calificacion"] });
	}
};

// Funcion para obtener una calificacion
export const getCalif_ParcialById = async (req, res) => {
	try {
		const calificacion = await Calif_Parciales.findById(req.params.id);
		if (!calificacion)
			return res.status(404).json({ message: ["Calificacion no encontrada"] });
		res.json(calificacion);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener la calificacion"] });
	}
};

// Funcion para eliminar una calificacion
export const deleteCalif_Parcial = async (req, res) => {
	try {
		const calificacion = await Calif_Parciales.findByIdAndDelete(req.params.id);
		if (!calificacion)
			return res.status(404).json({ message: ["Calificacion no encontrada"] });
		res.json(calificacion);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al eliminar la calificaion"] });
	}
};

// Funcion para editar una calificacion
export const updateCalif_Parcial = async (req, res) => {
	try {
		const calificacion = await Calif_Parciales.findByIdAndUpdate(
			req.params.id,
			req.body
		);
		if (!calificacion)
			return res.status(404).json({ message: ["Calificacion no encontrada"] });
		res.json(calificacion);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al actualizar la calificacion"] });
	}
};
