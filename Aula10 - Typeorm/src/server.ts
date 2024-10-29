import express, { Express, Request, Response } from "express";
import cors from "cors";
import { Usuario } from "./models/Usuario";
import "dotenv/config";

let server: Express = express();

server.use(cors());
server.use(express.json());

server.get("/usuarios", async (req: Request, res: Response) => {
  let users: Usuario[] = await Usuario.find();

  res.status(200).json(users);
  return;
});

server.post("/usuarios", async (req: Request, res: Response) => {
  let body = req.body;

  let usuario: Usuario = await Usuario.create({
    nome: body.nome,
    email: body.email,
    senha: body.senha,
  }).save();

  res.status(200).json(usuario);
  return;
});

server.put("/usuarios/:id", async (req: Request, res: Response) => {
  let body = req.body;
  let id = Number(req.params.id);

  let usuario: Usuario | null = await Usuario.findOneBy({ id });
  if (!usuario) {
    res.status(422).json({ error: "Usuario não encontrado!" });
    return;
  }

  usuario.nome = body.nome;
  usuario.email = body.email;
  usuario.senha = body.senha;
  await usuario.save();

  res.status(200).json(usuario);
  return;
});

server.delete("/usuarios/:id", async (req: Request, res: Response) => {
  let id = Number(req.params.id);

  let usuario: Usuario | null = await Usuario.findOneBy({ id });
  if (!usuario) {
    res.status(422).json({ error: "Usuario não encontrado!" });
    return;
  }

  usuario.remove();

  res.status(200).json();
  return;
});

server.get("/usuarios/:id", async (req: Request, res: Response) => {
  let id = Number(req.params.id);

  let usuario: Usuario | null = await Usuario.findOneBy({ id });
  if (!usuario) {
    res.status(422).json({ error: "Usuario não encontrado!" });
    return;
  }

  res.status(200).json(usuario);
  return;
});

export default {
  start() {
    server.listen(process.env.SERVER_PORT, () => {
      console.log("Server started on port " + process.env.SERVER_PORT);
    });
  },
};
