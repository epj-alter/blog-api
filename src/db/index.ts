/**
 * Import node-postgres
 */
import { Pool } from 'pg';

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
 * Create pool instance and connect it to the database
 */
const db = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  max: 20,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

/**
 * Export modified query function
 */
interface QueryOptions {
  queryString: string;
  queryParams?: any;
  log?: boolean;
}
/**
 * @param options : { "querystring", any?, log? }
 * @param returns Specify if the query returns an object
 */
export async function query(options: QueryOptions, returns?: boolean) {
  const start = Date.now();
  try {
    const response = await db.query(options.queryString, options?.queryParams);
    if (options.log) {
      const duration = Date.now() - start;
      console.log('Query Executed: ', {
        text: options.queryString,
        duration,
        rows: response.rowCount,
      });
    }
    if (returns && response.rows.length > 0 && response) {
      return response.rows;
    }
  } catch (error) {
    if (options.log) {
      console.log(error.severity + ' ' + error.code + ' OCCURRED');
    }
    return error;
  }
}
