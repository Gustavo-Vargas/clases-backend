import mongoose from "mongoose";

const actividadSchema = mongoose.Schema({
	clase: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Clase",
		require: true,
	},
	nombre: {
		type: String,
		required: true,
		trim: true,
	},
	descripcion: {
		type: String,
		trim: true,
	},
	fecha_entrega: {
		type: Date,
		required: true,
	},
	parcial: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Parcial",
		require: true,
	},
	criterio: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Criterio",
		require: true,
	},
});

export default mongoose.model("Actividad", actividadSchema);
