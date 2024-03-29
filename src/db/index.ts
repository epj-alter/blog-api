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
/**
 * @param log Specify if the query should be logged in the console
 */
export async function query(
  queryString: string,
  params?: any[],
  quantity: number = 0,
  log = false
) {
  const start = Date.now();
  try {
    const response = await db.query(queryString, params);
    if (log) {
      const duration = Date.now() - start;
      console.log('Query Executed: ', {
        text: queryString,
        duration,
        rows: response.rowCount,
      });
    }
    if (quantity == 1 && response && response.rowCount > 0) {
      // RETURN JUST ONE OBJECT
      return response.rows[0];
    } else if (quantity <= 0 && response && response.rowCount > 0) {
      // RETURN ALL THE OBJECTS
      return response.rows;
    } else if (quantity > 1 && response && response.rowCount > 0) {
      //RETURN THE SPECIFIED NUMBER OF OBJECTS OR ALL THE OBJECTS
      let response_array: any[] = [];
      for (let i = 0; i < quantity && i < response.rowCount; i++) {
        response_array.push(response.rows[i]);
      }
      return response_array;
    }
  } catch (error) {
    if (log) {
      console.log(`An error ocurred: ${error.severity} ${error.code}`);
    }
    return error;
  }
}
