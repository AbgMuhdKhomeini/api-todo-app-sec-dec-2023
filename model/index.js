import pool from "../database/connection.js";
// model is a file where we define our database schema / tables

// table users

export async function createUserTable() {
  try {
    const query = `CREATE TABLE IF NOT EXISTS "Users" (
        id SERIAL PRIMARY KEY,
        username VARCHAR(120) UNIQUE,
        email TEXT UNIQUE,
        password TEXT
    );`;
    await pool.query(query);
    console.log("User table created successfully");
  } catch (error) {
    console.log(error);
  }
}

// table todos

export async function createTodoTable() {
  try {
    // first initialize user table
    const queryInit = `CREATE TABLE IF NOT EXISTS "Todos" (
            id SERIAL PRIMARY KEY,
            title TEXT,
            description TEXT,
            user_id INTEGER REFERENCES "Users"(id)
        );`;

    // alter table to set text and description to not null and create new column status with default value false
    const queryAlter = `ALTER TABLE "Todos"
    ALTER COLUMN title SET NOT NULL,
    ALTER COLUMN description SET NOT NULL,
    ADD COLUMN IF NOT EXISTS status BOOLEAN DEFAULT false
    `;

    await pool.query(queryInit);
    await pool.query(queryAlter);
    console.log("Todo table created succesfully");
  } catch (error) {
    console.log(error);
  }
}
