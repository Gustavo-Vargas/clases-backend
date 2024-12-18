import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},

		rol: {
			type: Boolean,
			require: false,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("User", userSchema);
