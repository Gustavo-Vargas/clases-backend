import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const url = process.env.MONGODB_URL;

		await mongoose
			.connect(url)
			.then(() => {
				console.log("Base de datos conectada");
			})
			.catch((err) => {
				console.log(err);
			});

		// await mongoose.connect("mongodb://127.0.0.1/clases");
		// console.log("Base de datos conectada");
	} catch (error) {
		console.log(error);
	}
};
