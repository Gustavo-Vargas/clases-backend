import mongoose from "mongoose";

const alumnoSchema = mongoose.Schema(
	{
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
		apellido: {
			type: String,
			required: true,
			trim: true,
		},
		matricula: {
			type: Number,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Alumno", alumnoSchema);
