import Actividades from "../models/actividad.model.js";
import Clases from "../models/clase.model.js";
import Parciales from "../models/parcial.model.js";
import Criterios from "../models/criterio.model.js";
import { parse, isValid, format } from "date-fns";

// Funcion para obtener todas las actividades
export const getActividades = async (req, res) => {
	try {
		const { clase } = req.query;

		const claseFound = await Clases.findById(clase);
		if (!claseFound)
			return res.status(404).json({ message: ["No se encontro la clase"] });

		const actividades = await Actividades.find({
			clase: claseFound._id,
		})
			.populate("parcial")
			.populate("criterio");

		// Formatear las fechas antes de enviarlas
		const actividadesFormateadas = actividades.map((actividad) => ({
			...actividad.toObject(),
			fecha_entrega: format(actividad.fecha_entrega, "dd/MM/yyyy"), // Formatear la fecha
		}));

		res.json(actividadesFormateadas);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener los parciales"] });
	}
};

// Funcion para crear una actividad
export const createActividad = async (req, res) => {
	try {
		const { clase, nombre, descripcion, fecha_entrega, parcial, criterio } =
			req.body;

		// Buscar el id de la clase
		const claseFound = await Clases.findById(clase);
		if (!claseFound)
			return res.status(404).json({ message: ["Clase no encontrada"] });

		// Buscar el id del parcial
		const parcialFound = await Parciales.findById(parcial);
		if (!parcialFound)
			return res.status(404).json({ message: ["Parcial no encontrado"] });

		// Buscar el id del criterio
		const criterioFound = await Criterios.findById(criterio);
		if (!criterioFound)
			return res.status(404).json({ message: ["Criterio no encontrado"] });

		// Validar y parsear las fechas, asegurando que son strings
		if (typeof fecha_entrega !== "string") {
			return res.status(400).json({ message: ["Fecha inválidas"] });
		}

		const parsedFecha = parse(fecha_entrega, "dd/MM/yyyy", new Date());

		if (!isValid(parsedFecha)) {
			return res.status(400).json({ message: ["Fecha inválidas"] });
		}

		console.log("Si se valuido la fecha");

		const newActividad = new Actividades({
			clase: claseFound._id,
			nombre,
			descripcion,
			fecha_entrega: parsedFecha,
			parcial: parcialFound._id,
			criterio: criterioFound._id,
		});

		console.log("Se creo la actividada");

		const savedActividad = await newActividad.save();
		res.json(savedActividad);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al crear la actividad"] });
	}
};

// Funcion para obtener una actividad
export const getActividadById = async (req, res) => {
	try {
		const actividad = await Actividades.findById(req.params.id);
		if (!actividad)
			return res.status(404).json({ message: ["Actividad no encontrada"] });
		res.json(actividad);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener la actividad"] });
	}
};

// Funcion para eliminar una actividad
export const deleteActividad = async (req, res) => {
	try {
		const actividad = await Actividades.findByIdAndDelete(req.params.id);
		if (!actividad)
			return res.status(404).json({ message: ["Actividad no encontrada"] });
		res.json(actividad);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al eliminar la actividad"] });
	}
};

// Funcion para editar una actividad
export const updateActividad = async (req, res) => {
	try {
		const actividad = await Actividades.findByIdAndUpdate(
			req.params.id,
			req.body
		);
		if (!actividad)
			return res.status(404).json({ message: ["Actividad no encontrada"] });
		res.json(actividad);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al actualizar la actividad"] });
	}
};
