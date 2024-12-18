import mongoose from "mongoose";

const asistenciaSchema = mongoose.Schema({
	clase: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Clase",
		require: true,
	},
	alumno: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Alumno",
		require: true,
	},
	fecha: {
		type: Date,
		required: true,
	},
	estado: {
		type: String, // Ejemplo: "Presente", "Ausente", "Tarde"
		trim: true,
		required: true,
	},
});

export default mongoose.model("Asistencia", asistenciaSchema);
