import express from "express";
import dbInit from "./database/dbinit.js";
import { checkHealth } from "./controller/health.js";
import {
  register,
  login,
  users,
  usersid,
  updateUsers,
  deleteUser,
} from "./controller/auth.js";
import todoController from "./controller/todo.js";
import isAuth from "./middleware/isAuth.js";

const app = express();
const PORT = 3000;

// middleware for req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initialize database
dbInit();

// routes
app.get("/", checkHealth);
// this is how we send REST API response
app.post("/register", register);
app.post("/login", login);
app.get("/users", isAuth, users);
app.get("/users/:id", isAuth, usersid);
app.put("/update", isAuth, updateUsers);
app.delete("/delete", isAuth, deleteUser);
app.post("/todo", isAuth, todoController.create);
app.get("/todo", isAuth, todoController.list);
app.put("/todo/:id", isAuth, todoController.update);
app.delete("/todo/:id", isAuth, todoController.delete);
app.get("/todo", isAuth, todoController.view);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
