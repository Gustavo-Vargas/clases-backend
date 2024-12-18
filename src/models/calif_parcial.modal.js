import mongoose from "mongoose";

const calif_parcialSchema = mongoose.Schema({
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
	parcial: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Parcial",
		require: true,
	},
	nota: {
		type: Number,
		required: true,
		trim: true,
	},
});

export default mongoose.model("Calif_Parcial", calif_parcialSchema);
