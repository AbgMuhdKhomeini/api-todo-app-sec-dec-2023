import { checkConnection } from "./connection.js";
import { createUserTable, createTodoTable } from "../model/index.js";

async function dbInit() {
  await checkConnection();
  await createUserTable();
  await createTodoTable();
}

export default dbInit;
