/**
 * Import Simple Structure Modeler
 */
import { SSM } from '../ssm/';

/**
 * Import .env variables
 */
import 'dotenv/config';

const DB_USER: string = process.env.DB_USER as string;
const DB_HOST: string = process.env.DB_HOST as string;
const DB_NAME: string = process.env.DB_NAME as string;
const DB_PASSWORD: string = process.env.DB_PASSWORD as string;
const DB_PORT: number = parseInt(process.env.DB_PORT as string);

/**
 * Create instance of an ssm pool and connect it to the database
 */
export const ssm = new SSM('postgres', {
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  max: 20,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000
});
