import mongoose from "mongoose";

const membresiaSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			require: true,
		},
		estado: {
			type: String,
			trim: true,
			requerid: true,
		},
		fecha_inicio: {
			type: Date,
			requerid: true,
		},
		fecha_expiracion: {
			type: Date,
			requerid: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Membresia", membresiaSchema);
