import Parciales from "../models/parcial.model.js";
import Clases from "../models/clase.model.js";

// Funcion para obtener todos los parciales
export const getParciales = async (req, res) => {
	try {
		const parciales = await Parciales.find({ clase: req.query.clase }).populate(
			"clase"
		);

		res.json(parciales);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener los parciales"] });
	}
};

// Funcion para crear un parcial
export const createParcial = async (req, res) => {
	try {
		const { nombre, clase } = req.body;

		// Buscar el id de la clase
		const claseFound = await Clases.findById(clase);
		if (!claseFound)
			return res.status(404).json({ message: "La Clase no se encontro" });

		const newParcial = new Parciales({
			nombre,
			clase: claseFound._id,
		});

		const savedParcial = await newParcial.save();
		res.json(savedParcial);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al crear el parcial"] });
	}
};

// Funcion para obtener un parcial
export const getParcialById = async (req, res) => {
	try {
		const parcial = await Parciales.findById(req.params.id);
		if (!parcial)
			return res.status(404).json({ message: ["Parcial no encontrado"] });
		res.json(parcial);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener el parcial"] });
	}
};

// Funcion para eliminar un parcial
export const deleteParcial = async (req, res) => {
	try {
		const parcial = await Parciales.findByIdAndDelete(req.params.id);
		if (!parcial)
			return res.status(404).json({ message: ["Parcial no encontrado"] });
		res.json(parcial);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al eliminar el parcial"] });
	}
};

// Funcion para editar un productos
export const updateParcial = async (req, res) => {
	try {
		const parcial = await Parciales.findByIdAndUpdate(req.params.id, req.body);
		if (!parcial)
			return res.status(404).json({ message: ["Parcial no encontrado"] });
		res.json(parcial);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al actualizar el parcial"] });
	}
};
