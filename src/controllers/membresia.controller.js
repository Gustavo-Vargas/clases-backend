import Membresias from "../models/membresia.model.js";
import { parse, isValid } from "date-fns";

// Funcion para obtener todas las membresias
export const getMembresias = async (req, res) => {
	try {
		console.log("Obteniendo todas las membresías");

		// Busca todas las membresías y popula el campo "user"
		const membresias = await Membresias.find().populate("user");

		// Verifica si no hay membresías en la base de datos
		if (!membresias.length) {
			return res.status(404).json({ message: "No se encontraron membresías." });
		}

		// Envía las membresías como respuesta
		res.json(membresias);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener las membresias"] });
	}
};

// Funcion para crear una membresia
export const createMembresias = async (req, res) => {
	try {
		const newMembresia = new Membresias({
			estado: "Sin membresia",
			user: req.user.id,
		});

		const savedMembresia = await newMembresia.save();
		res.json(savedMembresia);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al crear la membresia"] });
	}
};

// Funcion para obtener una membresia
export const getMembresiaById = async (req, res) => {
	try {
		console.log("params", req.params);

		const membresia = await Membresias.findOne({ user: req.params.id });
		if (!membresia)
			return res.status(404).json({ message: ["Membresia no encontrada"] });
		console.log(membresia);

		res.json(membresia);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener la membresia"] });
	}
};

// Funcion para eliminar una membresia
export const deleteMembresias = async (req, res) => {
	try {
		const membresia = await Membresias.findByIdAndDelete(req.params.id);
		if (!membresia)
			return res.status(404).json({ message: ["Membresia no encontrada"] });
		res.json(membresia);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al eliminar la membresia"] });
	}
};

// Funcion para editar una membresia
export const updateMembresias = async (req, res) => {
	try {
		const { estado, fecha_inicio, fecha_expiracion } = req.body;
		// Validar y parsear las fechas, asegurando que son strings
		let parsedFechaInicio, parsedFechaFinal;
		if (fecha_inicio && typeof fecha_inicio === "string") {
			parsedFechaInicio = parse(fecha_inicio, "dd/MM/yyyy", new Date());
			if (!isValid(parsedFechaInicio)) {
				return res.status(400).json({ message: "Fecha de inicio inválida" });
			}
		}

		if (fecha_expiracion && typeof fecha_expiracion === "string") {
			parsedFechaFinal = parse(fecha_expiracion, "dd/MM/yyyy", new Date());
			if (!isValid(parsedFechaFinal)) {
				return res.status(400).json({ message: "Fecha de fin inválida" });
			}
		}

		// Crear objeto con los datos actualizados
		const updateData = {
			estado,
			fecha_inicio: parsedFechaInicio || fecha_inicio, // Usa la fecha parseada si existe
			fecha_expiracion: parsedFechaFinal || fecha_expiracion,
		};

		const membresia = await Membresias.findByIdAndUpdate(
			req.params.id,
			updateData,
			{
				new: true,
			}
		);

		if (!membresia)
			return res.status(404).json({ message: ["Membresia no encontrada"] });
		res.json(membresia);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al actualizar la membresia"] });
	}
};
