import mongoose from "mongoose";

const parcialSchema = new mongoose.Schema(
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
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Parcial", parcialSchema);
