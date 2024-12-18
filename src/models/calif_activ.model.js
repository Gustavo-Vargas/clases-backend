import mongoose from "mongoose";

const calif_activSchema = mongoose.Schema({
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
	actividad: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Actividad",
		require: true,
	},
	nota: {
		type: Number,
		required: true,
		trim: true,
	},
});

export default mongoose.model("Calif_Activ", calif_activSchema);
