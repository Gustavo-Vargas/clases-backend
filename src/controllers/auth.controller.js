// Importamos el modelo de datos
import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

// Función para registrar usuarios
export const registerAdmin = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		// Validamos que el email no este registrado en la bae de datos
		const userFound = await User.findOne({ email });
		if (userFound)
			// Si encontro un usuario que ya tenga ese email
			return res
				.status(400) // Retorna un mensaje de error
				.json({ message: ["El email ya esta en uso"] });

		const passwordHash = await bcryptjs.hash(password, 10);
		const newUser = new User({
			username,
			email,
			password: passwordHash,
			rol: true,
		});

		const userSaved = await newUser.save();
		//console.log(userSaved);
		const token = await createAccessToken({ id: userSaved._id });

		res.json({
			id: userSaved._id,
			username: userSaved.username,
			email: userSaved.email,
			rol: userSaved.rol,
			createdAt: userSaved.createdAt,
			updatedAt: userSaved.updatedAt,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al registrarte"] });
	}
};

// Función para registrar usuarios
export const register = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		// Validamos que el email no este registrado en la bae de datos
		const userFound = await User.findOne({ email });
		if (userFound)
			// Si encontro un suuario que ya tenga ese email
			return res
				.status(400) // Retorna un mensaje de error
				.json({ message: ["El email ya esta en uso"] });

		const passwordHash = await bcryptjs.hash(password, 10);
		const newUser = new User({
			username,
			email,
			password: passwordHash,
		});

		const userSaved = await newUser.save();
		//console.log(userSaved);
		const token = await createAccessToken({ id: userSaved._id });
		res.cookie("token", token, {
			sameSite: "none",
			secure: true,
		});
		res.json({
			id: userSaved._id,
			username: userSaved.username,
			email: userSaved.email,
			createdAt: userSaved.createdAt,
			updatedAt: userSaved.updatedAt,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al registrarte"] });
	}
};

// Función para iniciar sesión
export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const userFound = await User.findOne({ email });
		if (!userFound) {
			return res.status(400).json({ message: ["Usuario no encontrado"] });
		}

		// Comparamos el passwotd que envio el usuario con el de la base de datos
		const isMatch = await bcryptjs.compare(password, userFound.password);
		if (!isMatch) {
			return res.status(400).json({ message: ["Password no cincide"] });
		}
		const token = await createAccessToken({ id: userFound._id });
		res.cookie("token", token, {
			sameSite: "none",
			secure: true, // Para activar la opcion de que el back y front esten en diferentes servers
		});

		if (userFound.rol === true) {
			return res.json({
				id: userFound._id,
				username: userFound.username,
				email: userFound.email,
				rol: userFound.rol,
				createdAt: userFound.createdAt,
				updatedAt: userFound.updatedAt,
			});
		}

		// Si el rol no es true, se envía esta respuesta
		res.json({
			id: userFound._id,
			username: userFound.username,
			email: userFound.email,
			createdAt: userFound.createdAt,
			updatedAt: userFound.updatedAt,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al iniciar sesion"] });
	}
};

export const logout = (req, res) => {
	res.clearCookie("token");
	return res.sendStatus(200);
};

// Funcion para el perfil del usuario
export const profile = async (req, res) => {
	const userFound = await User.findById(req.user.id);

	if (!userFound) return res.status(400).json({ message: ["User not found"] });

	return res.json({
		id: userFound._id,
		username: userFound.username,
		email: userFound.email,
	});
}; // Fin del profile

// Función para validar el token de inicio de sesión
export const verifyToken = async (req, res) => {
	const { token } = req.cookies;

	if (!token) return res.status(401).json({ message: ["No Autorizado"] });

	jwt.verify(token, TOKEN_SECRET, async (err, user) => {
		if (err)
			// Si hay un error al validar el token
			return res.status(401).json({ message: ["No autorizado"] });

		const userFound = await User.findById(user.id);
		if (!userFound)
			// Si no encuentra el usuario que viene en el token
			return res.status(401).json({ message: ["No autorizado"] });

		return res.json({
			id: userFound._id,
			username: userFound.username,
			email: userFound.email,
		}); // Fin del return res.json
	}); // Fin del jwt.verify
}; // Fin de verifyToken

// Función para obtener los usuarios con rol 'true'
export const getUsers = async (req, res) => {
	try {
		console.log("Obteniendo todos los usuarios con rol 'true'");

		// Busca todos los usuarios que tengan rol 'true'
		const users = await User.find({ rol: true }); // Filtra los usuarios con rol: true

		console.log(users);

		// Verifica si no se encontraron usuarios con rol 'true'
		if (!users.length) {
			return res
				.status(404)
				.json({ message: "No se encontraron usuarios con rol 'true'." });
		}

		// Envía los usuarios con rol 'true' como respuesta
		res.json(users);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener los usuarios." });
	}
};

// Funcion para eliminar un productos
export const deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) return res.status(404).json({ message: ["user no encontrado"] });
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al eliminar el user"] });
	}
};

// Funcion para editar un productos
export const updateUser = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body);
		if (!user) return res.status(404).json({ message: ["user no encontrado"] });
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: ["Error al actualizar el user"] });
	}
};
