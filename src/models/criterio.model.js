import mongoose from "mongoose";

const criterioSchema = new mongoose.Schema(
	{
		clase: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Clase",
			require: true,
		},
		nombre: {
			type: String,
			trim: true,
			requerid: true,
		},
		porcentaje: {
			type: Number,
			requerid: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Criterio", criterioSchema);
