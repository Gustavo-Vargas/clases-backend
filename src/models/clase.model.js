import mongoose from "mongoose";

const claseSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
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

		hora_inicio: {
			type: String,
			requerid: true,
		},
		hora_fin: {
			type: String,
			requerid: true,
		},

		fecha_inicio: {
			type: Date,
			requerid: true,
		},
		fecha_fin: {
			type: Date,
			requerid: true,
		},
		dias: {
			type: [String], // Ejemplo: ["lunes", "miércoles"]
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Clase", claseSchema);
