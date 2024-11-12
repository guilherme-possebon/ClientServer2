import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";

export class UsuariosController {
  async list(req: Request, res: Response) {
    let users: Usuario[] = await Usuario.find();

    res.status(200).json(users);
    return;
  }

  async find(req: Request, res: Response) {
    let id = Number(req.params.id);

    let usuario: Usuario | null = await Usuario.findOneBy({ id });
    if (!usuario) {
      res.status(422).json({ error: "Usuario não encontrado!" });
      return;
    }

    res.status(200).json(usuario);
    return;
  }

  async create(req: Request, res: Response) {
    let body = req.body;

    console.log(body);

    let usuario: Usuario = await Usuario.create({
      nome: body.nome,
      email: body.email,
      senha: body.senha,
    }).save();

    res.status(200).json(usuario);
    return;
  }

  async update(req: Request, res: Response) {
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
  }

  async delete(req: Request, res: Response) {
    let id = Number(req.params.id);

    let usuario: Usuario | null = await Usuario.findOneBy({ id });
    if (!usuario) {
      res.status(422).json({ error: "Usuario não encontrado!" });
      return;
    }

    usuario.remove();

    res.status(200).json();
    return;
  }
}
