import Clases from "../models/clase.model.js";
import { parse, isValid } from "date-fns";
import Actividades from "../models/actividad.model.js";
import Alumnos from "../models/alumno.model.js";
import Asistencia from "../models/asistencia.model.js";
import Parciales from "../models/parcial.model.js";
import Criterios from "../models/criterio.model.js";
import Calif_Activs from "../models/calif_activ.model.js";
import Calif_Parciales from "../models/calif_parcial.modal.js";

// Funcion para obtener todos los productos
export const getClases = async (req, res) => {
	try {
		const clases = await Clases.find({ user: req.user.id }).populate("user");
		res.json(clases);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener los productos"] });
	}
};

// Funcion para crear un productos
export const createClase = async (req, res) => {
	try {
		console.log("Entre a CreateClase");

		const {
			nombre,
			descripcion,
			fecha_inicio,
			fecha_fin,
			hora_inicio,
			hora_fin,
			dias,
		} = req.body;

		console.log(req.body);

		// Validar y parsear las fechas, asegurando que son strings
		if (typeof fecha_inicio !== "string" || typeof fecha_fin !== "string") {
			return res.status(400).json({ message: "Fechas inválidas" });
		}

		const parsedFechaInicio = parse(fecha_inicio, "dd/MM/yyyy", new Date());
		const parsedFechaFinal = parse(fecha_fin, "dd/MM/yyyy", new Date());

		if (!isValid(parsedFechaInicio) || !isValid(parsedFechaFinal)) {
			return res.status(400).json({ message: "Fechas inválidas" });
		}

		 // Definir el orden de los días de la semana (de lunes a domingo)
		const diasOrdenados = [
			"Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
		];

		// Ordenar los días en base al array 'diasOrdenados'
		const diasOrdenadosInput = dias.sort((a, b) => {
			return diasOrdenados.indexOf(a) - diasOrdenados.indexOf(b);
		  });

		const newClase = new Clases({
			nombre,
			descripcion,
			fecha_inicio: parsedFechaInicio,
			fecha_fin: parsedFechaFinal,
			hora_inicio,
			hora_fin,
			dias: diasOrdenadosInput,  // Usar los días ordenados
			user: req.user.id,
		  });

		const savedClase = await newClase.save();
		res.json(savedClase);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al crear la clase"] });
	}
};

// Funcion para obtener un productos
export const getClaseById = async (req, res) => {
	try {
		const clase = await Clases.findById(req.params.id);
		if (!clase)
			return res.status(404).json({ message: ["Clase no encontrada"] });
		res.json(clase);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al obtener la clase"] });
	}
};

// Funcion para eliminar un productos
export const deleteClase = async (req, res) => {
	try {
		console.log("Parametros",req.params);
		const { id } = req.params;

		// Buscar la clase por su ID
		const clase = await Clases.findById(id);
		if (!clase) {
			return res.status(404).json({ message: ["Clase no encontrada"] });
		}

		// Eliminar todas las actividades relacionadas con la clase
		await Actividades.deleteMany({ clase: id });

		// Eliminar todos los alumnos que están relacionados con la clase
		await Alumnos.deleteMany(
			{ clases: id },
			// { $pull: { clases: id } } // Eliminamos la clase de la lista de clases de cada alumno
		);

		// Eliminar registros de asistencia relacionados con la clase
		await Asistencia.deleteMany({ clase: id });

		// Eliminar calificaciones de actividades relacionadas con la clase
		await Calif_Activs.deleteMany({ clase: id });

		// Eliminar calificaciones de parciales relacionadas con la clase
		await Calif_Parciales.deleteMany({ clase: id });

		// Eliminar criterios relacionados con la clase
		await Criterios.deleteMany({ clase: id });

		// Eliminar parciales relacionados con la clase
		await Parciales.deleteMany({ clase: id });

		// Finalmente, eliminar la clase
		await Clases.findByIdAndDelete(id);

		// Responder al cliente con un mensaje de éxito
		res.json({ message: "Clase y sus datos relacionados eliminados correctamente" });

		
		// const clase = await Clases.findByIdAndDelete(req.params.id);
		// if (!clase)
		// 	return res.status(404).json({ message: ["Clase no encontrada"] });
		// res.json(clase);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al eliminar la clase"] });
	}
};

// Funcion para editar un productos
export const updateClase = async (req, res) => {
	try {
		const {
			nombre,
			descripcion,
			fecha_inicio,
			fecha_fin,
			hora_inicio,
			hora_fin,
			dias,
		} = req.body;

		// Validar y parsear las fechas, asegurando que son strings
		let parsedFechaInicio, parsedFechaFinal;
		if (fecha_inicio && typeof fecha_inicio === "string") {
			parsedFechaInicio = parse(fecha_inicio, "dd/MM/yyyy", new Date());
			if (!isValid(parsedFechaInicio)) {
				return res.status(400).json({ message: "Fecha de inicio inválida" });
			}
		}

		if (fecha_fin && typeof fecha_fin === "string") {
			parsedFechaFinal = parse(fecha_fin, "dd/MM/yyyy", new Date());
			if (!isValid(parsedFechaFinal)) {
				return res.status(400).json({ message: "Fecha de fin inválida" });
			}
		}

		// Crear objeto con los datos actualizados
		const updateData = {
			nombre,
			descripcion,
			fecha_inicio: parsedFechaInicio || fecha_inicio, // Usa la fecha parseada si existe
			fecha_fin: parsedFechaFinal || fecha_fin,
			hora_inicio,
			hora_fin,
			dias,
		};

		// Filtra las propiedades undefined
		Object.keys(updateData).forEach(
			(key) => updateData[key] === undefined && delete updateData[key]
		);

		const clase = await Clases.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
		});

		if (!clase)
			return res.status(404).json({ message: ["Clase no encontrada"] });

		res.json(clase);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al actualizar la clase"] });
	}
};

// Funcion para obtener el calendario con forme a los dias
export const obtenerCalendario = async (req, res) => {
	try {
		const clases = await Clases.find({ user: req.user.id }).populate("user");
		// Organizar las clases por día de la semana y horario
		const calendario = {
			Lunes: [],
			Martes: [],
			Miércoles: [],
			Jueves: [],
			Viernes: [],
			Sábado: [],
			Domingo: [],
		};

		clases.forEach((clase) => {
			clase.dias.forEach((dia) => {
				const claseData = {
					nombre: clase.nombre,
					hora_inicio: clase.hora_inicio,
					hora_fin: clase.hora_fin,
				};
				calendario[dia].push(claseData);
			});
		});
		console.log(calendario);

		res.json(calendario); // Enviar el calendario organizado
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener el calendario" });
	}
};
