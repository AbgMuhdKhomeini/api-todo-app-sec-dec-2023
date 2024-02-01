import jwt from "jsonwebtoken";
import pool from "../database/connection.js";
import bcrypt from "bcrypt";
import { decyrpt, encrypt } from "../utils/encryption.js";

export async function register(req, res) {
  try {
    const reqBody = req.body;

    // check if email, username and password provided
    if (!reqBody.email || !reqBody.username || !reqBody.password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // create hash of password
    // 10 means 2 power of 10 rounds of hashing
    // 2^10 1024 rounds of hashing 150ms
    // 2^11 2048 rounds of hashing 300ms
    // 2^12 4096 rounds of hashing, quadruples the time taken to hash 10 times 600ms
    // the best practice to use 10 rounds of hashing /https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(reqBody.password, salt);

    // encrypt email by using node.js core module crypto
    const encryptedUsername = encrypt(reqBody.username);
    const encryptedEmail = encrypt(reqBody.email);

    //create new user in database
    const query = `INSERT INTO "Users" (username, email, "password")
    VALUES ($1, $2, $3);`;
    // const values = [reqBody.username, reqBody.email, reqBody.password];
    const values = [encryptedUsername, encryptedEmail, hashedPassword];
    await pool.query(query, values);
    const apiResponse = {
      message: "User created succesfully",
    };
    res.status(200).json(apiResponse);
  } catch (error) {
    res.status(500).json(error);
  }
}

export async function login(req, res) {
  try {
    const reqBody = req.body;
    const encryptedEmail = encrypt(reqBody.email);
    // check if email existing in database
    const query = `SELECT * FROM "Users" WHERE email=$1;`;
    const values = [encryptedEmail];
    const response = await pool.query(query, values);

    //if email not exist return 404
    if (response.rowCount === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    // if email found check if password match
    // check the match by using bcrypt.compare()

    //compare using string password
    // if (reqBody.password !== response.rows[0].password) {
    //   return res.status(401).json({ message: "Password incorrect" });
    // }

    // compare using hashed password
    const isPasswordCorrect = await bcrypt.compare(
      reqBody.password,
      response.rows[0].password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    // decyrpt username
    const decryptedUsername = decyrpt(response.rows[0].username);
    const decyrptedEmail = decyrpt(response.rows[0].email);

    // if password matches, create a token using jsonwebtoken
    const userData = {
      id: response.rows[0].id,
      username: decryptedUsername,
      email: decyrptedEmail,
    };
    const token = jwt.sign(userData, "superdupersecret");

    // if password matches, return users object
    const apiResponse = {
      message: "Login Successful",
      user: {
        id: response.rows[0].id,
        username: decryptedUsername,
        email: decyrptedEmail,
      },
      token: token,
    };
    res.status(200).json(apiResponse);
  } catch (error) {
    res.status(500).json(error);
  }
}

// List all users
// route : GET/users

export async function users(req, res) {
  try {
    const query = `SELECT * FROM "Users";`;
    const response = await pool.query(query);
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get user by id
// route : Get/users/:id

export async function usersid(req, res) {
  // try {
  //   const reqBody = req.body;
  //   const query = `SELECT * FROM "Users" WHERE id=$1;`;
  //   const values = [reqBody.id];
  //   const response = await pool.query(query, values);
  //   res.status(200).json(response.rows);
  // } catch (error) {
  //   res.status(500).json(error);
  // }
  try {
    const id = req.params.id;
    const username = req.body.username;
    const email = req.body.email;

    // validate if id is exist in database or not then return response 400 if not exist
    // const queryCheck = `SELECT * FROM "Users" WHERE id=$1`;
    // const checkId = await pool.query(queryCheck, [id]);

    // if (checkId.rowCount === 0) {
    //   return res
    //     .status(400)
    //     .json({ message: `details with id ${id} not found` });
    // }

    // // validate if the details of user is belong to the user, then return response 400 if not belong
    // const queryCheckUser = `SELECT * FROM "Users" WHERE id=$1 AND username=$2`;
    // const checkUser = await pool.query(queryCheckUser, [id, username]);

    // if (checkUser.rowCount === 0) {
    //   return res
    //     .status(400)
    //     .json({ message: `details with id ${id} is not yours` });
    // }

    const query = `SELECT * FROM "Users" WHERE id=$1`;
    const values = [id, username, email];

    const response = await pool.query(query, values);
    return res.json(response.rows);
  } catch (error) {
    res.status(500).json(error);
  }
}
// update user by id
// route : PUT/users/:id

export async function updateUsers(req, res) {
  try {
    const reqBody = req.body;
    const query = `UPDATE "Users" SET username = $2, email = $3, password = $4 WHERE id=$1;`;
    const values = [
      reqBody.id,
      reqBody.username,
      reqBody.email,
      reqBody.password,
    ];
    await pool.query(query, values);
    res.status(200).json({ message: "User update successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
}

// delete user by id
// route : DELETE/users/:id

export async function deleteUser(req, res) {
  try {
    const reqBody = req.body;
    const query = `DELETE FROM "Users" WHERE id = $1;`;
    const values = [reqBody.id];
    await pool.query(query, values);

    res.status(200).json({ message: "User has been remove" });
  } catch (error) {
    res.status(500).json(error);
  }
}
