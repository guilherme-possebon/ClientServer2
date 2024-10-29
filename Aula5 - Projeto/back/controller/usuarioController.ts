import { NextFunction, Request, Response } from "express";
import { Usuario } from "../model/Usuario";

export const findUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let authorization = req.get("Authorization")?.replace("Basic", "");
    let usuario = new Usuario();

    if (authorization) {
      let decoded = Buffer.from(authorization, "base64").toString("binary");
      let userPassword = decoded.split(":");
      usuario.username = userPassword[0];
      usuario.password = userPassword[1];
    }

    let result = await usuario.findUser();

    if (result) {
      next();
      return;
    }

    let erro = { erro: "Falha na autenticação" };

    res.status(401).json(erro);
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ erro: "Erro ao achar usuario." });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  let resultado = { id: null, resultado: "Login okay" };

  res.status(200).json(resultado);
  return;
};
