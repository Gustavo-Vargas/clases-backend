import Alumnos from "../models/alumno.model.js";
import Clases from "../models/clase.model.js";

// Funcion para obtener todos los productos
export const getAlumnos = async (req, res) => {
	try {
		const { clase } = req.query;

		const claseFound = await Clases.findById(clase);
		if (!claseFound)
			return res.status(404).json({ message: ["No se encontro la clase"] });

		// Buscar todos los alumnos de la clase y ordenarlos por matrícula
		const alumnos = await Alumnos.find({ clase: claseFound._id }).sort({
			matricula: 1,
		});

		res.json(alumnos);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener los alumnos"] });
	}
};

// Funcion para crear un productos
export const createAlumno = async (req, res) => {
	try {
		const { nombre, apellido, clase, matricula } = req.body;

		// Buscar el id de la clase
		const claseFound = await Clases.findById(clase);
		if (!claseFound)
			return res.status(404).json({ message: ["La Clase no se encontro"] });

		const matriculaFound = await Alumnos.findOne({
			matricula: matricula,
			clase: clase,
		});

		if (matriculaFound) {
			return res
				.status(400)
				.json({ message: ["La matrícula ya existe en esta clase"] });
		}

		const newAlumno = new Alumnos({
			nombre,
			apellido,
			matricula,
			clase: claseFound._id,
		});

		const savedAlumno = await newAlumno.save();
		res.status(201).json(savedAlumno);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al crear el alumno"] });
	}
};

// Funcion para obtener un productos
export const getAlumnoById = async (req, res) => {
	try {
		const alumno = await Alumnos.findById(req.params.id);
		if (!alumno)
			return res.status(404).json({ message: ["Alumno no encontrado"] });
		res.json(alumno);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener el Alumno"] });
	}
};

// Funcion para eliminar un productos
export const deleteAlumno = async (req, res) => {
	try {
		const alumno = await Alumnos.findByIdAndDelete(req.params.id);
		if (!alumno)
			return res.status(404).json({ message: ["Alumno no encontrado"] });
		res.json(alumno);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al eliminar el Alumno"] });
	}
};

// Funcion para editar un productos
export const updateAlumno = async (req, res) => {
	try {
		const alumno = await Alumnos.findByIdAndUpdate(req.params.id, req.body);
		if (!alumno)
			return res.status(404).json({ message: ["Alumno no encontrado"] });
		res.json(alumno);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al actualizar el Alumno"] });
	}
};
