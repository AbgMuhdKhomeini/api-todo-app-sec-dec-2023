// establish connection with database
import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  //add this for production
  ssl: process.env.DB_SSL,
});
// pool is a passport to send request to database

// const checkConnection = async () => {
//   try {
//     const client = await pool.connect();
//     console.log("Database Connected");
//     client.release();
//   } catch (error) {
//     console.error("Database connection error", err);
//   }
// };

export async function checkConnection() {
  try {
    // resolve promise
    const client = await pool.connect();
    console.log("Database Connected", client.database);
  } catch (error) {
    // rejected promise
    console.log("Could not connect to database", error);
  }
}

export default pool;
