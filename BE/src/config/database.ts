import mongoose from 'mongoose';
import { LogError, LogInfo } from '../utils/color-log.js';

const username = process.env.DATABASE_USER || '';
const password = process.env.DATABASE_PASSWORD || '';
const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT;
const dbName = process.env.DATABASE_DB || '';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(`mongodb://${host}:${port}/${dbName}`, {
      authSource: 'admin',
      user: username,
      pass: password,
      dbName: dbName,
      authMechanism: 'SCRAM-SHA-256',
    });
    LogInfo(
      'MongoDB',
      `Successfully Connected to Database: ${host}:${port}/${dbName} using 'SCRAM-SHA-256'`
    );
  } catch (error) {
    LogError('MongoDB', `Connection error: ${error}`);
    process.exit(1);
  }
};
