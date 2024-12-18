import Criterios from "../models/criterio.model.js";
import Clases from "../models/clase.model.js";

// Funcion para obtener todos los criterios
export const getCriterios = async (req, res) => {
	try {
		const criterios = await Criterios.find({ clase: req.query.clase });

		res.json(criterios);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener los criterios"] });
	}
};

// Funcion para crear un criterio
export const createCriterio = async (req, res) => {
	try {
		const { nombre, porcentaje, clase } = req.body;

		// Buscar el id de la clase
		const claseFound = await Clases.findById(clase);
		if (!claseFound)
			return res.status(404).json({ message: "Clase no encontrada" });

		// Sumar los porcentajes existentes
		const criteriosExistentes = await Criterios.find({ clase });
		const totalActual = criteriosExistentes.reduce(
			(total, crit) => total + crit.porcentaje,
			0
		);

		if (totalActual + porcentaje > 100) {
			return res.status(400).json({
				message: `La suma total de los porcentajes no puede exceder 100. Actualmente tienes ${totalActual}.`,
			});
		}

		const newCriterio = new Criterios({
			nombre,
			porcentaje,
			clase: claseFound._id,
		});

		const savedCriterio = await newCriterio.save();
		res.json(savedCriterio);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al crear el criterio"] });
	}
};

// Funcion para obtener un criterio
export const getCriterioById = async (req, res) => {
	try {
		const criterio = await Criterios.findById(req.params.id);
		if (!criterio)
			return res.status(404).json({ message: ["Criterio no encontrado"] });
		res.json(criterio);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener el criterio"] });
	}
};

// Funcion para eliminar un criterio
export const deleteCriterio = async (req, res) => {
	try {
		const criterio = await Criterios.findByIdAndDelete(req.params.id);
		if (!criterio)
			return res.status(404).json({ message: ["Criterio no encontrado"] });
		res.json(criterio);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al eliminar el criterio"] });
	}
};

// Funcion para editar un productos
export const updateCriterio = async (req, res) => {
	try {
		const criterio = await Criterios.findByIdAndUpdate(req.params.id, req.body);
		if (!criterio)
			return res.status(404).json({ message: ["Criterio no encontrado"] });
		res.json(criterio);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al actualizar el criterio"] });
	}
};
