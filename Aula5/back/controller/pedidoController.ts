import e, { Request, Response } from "express";
import { Pedido } from "../model/pedido";

export const getAllProduct = async (req: Request, res: Response) => {
  let pedido = new Pedido();

  let result = await pedido.listAll();

  res.status(200).json(result);
};

export const getOneByIdProduct = async (req: Request, res: Response) => {
  let id = Number(req.params.id);
  let pedido = new Pedido();

  let result = await pedido.findOneById(id);

  if (result != null) {
    res.status(200).json(result);
    return;
  }

  let erro = { id: id, erro: "Pedido não encontrada." };

  res.status(400).json(erro);
};
export const insertProduct = async (req: Request, res: Response) => {
  let pedido = new Pedido();
  pedido.situacao = req.body.situacao;
  pedido.nome = req.body.nome;
  pedido.cidade = req.body.cidade;
  pedido.siglaUf = req.body.siglaUf;
  pedido.formaPagamento = req.body.formaPagamento;
  pedido.prazoPagamento = req.body.prazoPagamento;
  pedido.tipoFrete = req.body.tipoFrete;
  pedido.observacoes = req.body.observacoes;

  let erros: string[] = pedido.validate();

  if (erros.length > 0) {
    let json = { erros: erros };
    res.status(400).json(json);
    return;
  }

  await pedido.save();

  if (pedido.id) {
    res.status(200).json(pedido);
    return;
  }

  let erro = { id: null, erro: "Erro ao inserir pedido." };

  res.status(400).json(erro);
};

export const updateProduct = async (req: Request, res: Response) => {
  let id = Number(req.params.id);
  let pedido = new Pedido();

  let result = await pedido.findOneById(id);

  if (result == null) {
    let erro = { id: id, erro: "Pedido não encontrado." };
    res.status(400).json(erro);
    return;
  }
  pedido.id = id;
  pedido.situacao = req.body.situacao;
  pedido.nome = req.body.nome;
  pedido.cidade = req.body.cidade;
  pedido.siglaUf = req.body.siglaUf;
  pedido.formaPagamento = req.body.formaPagamento;
  pedido.prazoPagamento = req.body.prazoPagamento;
  pedido.tipoFrete = req.body.tipoFrete;
  pedido.observacoes = req.body.observacoes;
  console.log(pedido);

  let erros: string[] = pedido.validate();

  if (erros.length > 0) {
    let json = { erros: erros };
    res.status(400).json(json);
    return;
  }

  pedido.save();

  if (pedido.id) {
    res.status(200).json(pedido);
    return;
  }

  let erro = { id: id, erro: "Erro ao editar pedido." };
  res.status(400).json(erro);
};

export const deleteProduct = async (req: Request, res: Response) => {
  let id = Number(req.params.id);
  let pedido = new Pedido();

  pedido.id = id;

  await pedido.delete();

  let retorno = { okay: true };
  res.status(200).json(retorno);
};
