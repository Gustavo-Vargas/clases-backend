import Asistencias from "../models/asistencia.model.js";
import Clases from "../models/clase.model.js";
import Alumnos from "../models/alumno.model.js";
import { parse, isValid } from "date-fns";

// Funcion para obtener todas las asistencias
export const getAsistencias = async (req, res) => {
	try {
		console.log(req.query.clase);

		const asistencias = await Asistencias.find({
			clase: req.query.clase,
		}).populate("clase");

		res.json(asistencias);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener las asistencias"] });
	}
};

// Funcion para crear una asistencia
export const createAsistencia = async (req, res) => {
	try {
		const { clase, alumno, fecha, estado } = req.body;

		// Buscar el id de la clase
		const claseFound = await Clases.findById(clase);
		if (!claseFound)
			return res.status(404).json({ message: "Clase no encontrada" });

		// Buscar el id del alumno
		const alumnoFound = await Alumnos.findById(alumno);
		if (!alumnoFound)
			return res.status(404).json({ message: "Alumno no encontrado" });

		// Validar y parsear la fecha, asegurando que son strings
		if (typeof fecha !== "string") {
			return res.status(400).json({ message: "Fecha inválida" });
		}
		const parsedFecha = parse(fecha, "dd/MM/yyyy", new Date());

		if (!isValid(parsedFecha)) {
			return res.status(400).json({ message: "Fecha inválida" });
		}

		const newAsistencia = new Asistencias({
			clase: claseFound._id,
			alumno: alumnoFound._id,
			fecha: parsedFecha,
			estado,
		});

		// const savedAsistencia = await newAsistencia.save();
		res.json(newAsistencia);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al crear la asistencia"] });
	}
};

// Funcion para obtener una asistencia
export const getAsistenciaById = async (req, res) => {
	try {
		const asistencia = await Asistencias.findById(req.params.id);
		if (!asistencia)
			return res.status(404).json({ message: ["Asistencia no encontrada"] });
		res.json(asistencia);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener la asistencia"] });
	}
};

// Funcion para eliminar una asistencia
export const deleteAsistencia = async (req, res) => {
	try {
		const asistencia = await Asistencias.findByIdAndDelete(req.params.id);
		if (!asistencia)
			return res.status(404).json({ message: ["Asistencia no encontrada"] });
		res.json(asistencia);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al eliminar la asistencia"] });
	}
};

// Funcion para editar una asistencia
export const updateAsistencia = async (req, res) => {
	try {
		const asistencia = await Asistencias.findByIdAndUpdate(
			req.params.id,
			req.body
		);
		if (!asistencia)
			return res.status(404).json({ message: ["Asistencia no encontrada"] });
		res.json(asistencia);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al actualizar la asistencia"] });
	}
};

// Función para generar los días de asistencia
export const getDiasAsistencia = async (req, res) => {
	try {
		const { clase } = req.query;
		// Buscamos la clase
		const claseFound = await Clases.findById(clase);
		if (!claseFound)
			return res.status(404).json({ message: ["Clase no encontrada"] });

		const { fecha_inicio, fecha_fin, dias } = clase;

		// Validar que los datos necesarios estén presentes
		if (!fecha_inicio || !fecha_fin || !dias || !Array.isArray(dias)) {
			return res.status(400).json({ message: ["Datos de clase incompletos"] });
		}

		const fechas = [];
		let fechaActual = new Date(fecha_inicio);
		const fechaFinal = new Date(fecha_fin);

		while (fechaActual <= fechaFinal) {
			const nombreDia = obtenerNombreDia(fechaActual);
			if (dias.includes(nombreDia)) {
				fechas.push(new Date(fechaActual));
			}
			fechaActual.setDate(fechaActual.getDate() + 1);
		}

		res.json({ fechas });
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ message: "Error al generar los días de asistencia" });
	}
};

// Función auxiliar para obtener el nombre del día
function obtenerNombreDia(fecha) {
	const nombresDias = [
		"Domingo",
		"Lunes",
		"Martes",
		"Miércoles",
		"Jueves",
		"Viernes",
		"Sábado",
	];
	return nombresDias[fecha.getDay()];
}
