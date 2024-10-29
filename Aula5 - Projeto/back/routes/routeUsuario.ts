import { Router } from "express";
import { findUser, login } from "../controller/usuarioController";

export const routeUsuario = Router();

routeUsuario.use(findUser);
routeUsuario.get("/", login);
