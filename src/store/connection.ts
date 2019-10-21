import { MongoConnection } from "../utils/mongo-connection";
import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017/mydb';
const connection = new MongoConnection(url);

//mongoose.set('debug', true);

mongoose.set('useFindAndModify', false);

async function connectDb(): Promise<void> {
  await connection.connect();
}

async function closeDb(): Promise<void> {
  await connection.close();
}

export {
  connectDb,
  closeDb,
};
