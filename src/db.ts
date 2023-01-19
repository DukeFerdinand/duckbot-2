import mongoose from 'mongoose'

export enum Models {
	Pepita = "Pepita"
}

export const PepitasState = new mongoose.Schema({
	user: mongoose.Schema.Types.Number
})

mongoose.model(Models.Pepita, PepitasState)

let mongooseConnection: mongoose.Connection;

export async function getMongooseConnection() {
	if (mongooseConnection) {
		return mongooseConnection
	}

	if (!process.env.DB_URL) throw new Error("Cannot connect to DB, DB_URL is undefined in env!")

 	await mongoose.connect(process.env.DB_URL!)
	mongooseConnection = mongoose.connection


	return mongooseConnection
}
