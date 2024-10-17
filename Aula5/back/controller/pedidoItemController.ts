import { Request, Response } from "express";
import { PedidoItem } from "../model/pedidoItem";

export const getAllProductItem = async (req: Request, res: Response) => {
  let pedidoItem = new PedidoItem();

  let result = await pedidoItem.listAll();

  res.status(200).json(result);
};

export const getOneByIdProductItem = async (req: Request, res: Response) => {
  let id = Number(req.params.id);
  let pedidoItem = new PedidoItem();

  let result = await pedidoItem.findOneById(id);

  if (result != null) {
    res.status(200).json(result);
    return;
  }

  let erro = { id: id, erro: "Pedido não encontrada." };

  res.status(400).json(erro);
};

export const insertProductItem = async (req: Request, res: Response) => {
  let pedidoItem = new PedidoItem();

  pedidoItem.idPedido = req.body.idPedido;
  pedidoItem.produto = req.body.produto;
  pedidoItem.quantidade = req.body.quantidade;
  pedidoItem.valorUnitario = req.body.valorUnitario;
  pedidoItem.valorTotal = req.body.valorTotal;

  let erros: string[] = pedidoItem.validate();

  if (erros.length > 0) {
    let json = { erros: erros };
    res.status(400).json(json);
    return;
  }

  await pedidoItem.save();

  if (pedidoItem.id) {
    res.status(200).json(pedidoItem);
    return;
  }

  res.status(400).json({ erro: "Erro ao inserir pedido." });
};

export const updateProductItem = async (req: Request, res: Response) => {
  let id = Number(req.params.id);
  let pedidoItem = new PedidoItem();

  let result = await pedidoItem.findOneById(id);

  if (result == null) {
    let erro = { id: id, erro: "Pedido não encontrado." };
    res.status(400).json(erro);
    return;
  }
  pedidoItem.id = id;
  pedidoItem.idPedido = req.body.idPedido;
  pedidoItem.produto = req.body.produto;
  pedidoItem.quantidade = req.body.quantidade;
  pedidoItem.valorUnitario = req.body.valorUnitario;
  pedidoItem.valorTotal = req.body.valorTotal;

  console.log(pedidoItem);

  let erros: string[] = pedidoItem.validate();

  if (erros.length > 0) {
    let json = { erros: erros };
    res.status(400).json(json);
    return;
  }

  pedidoItem.save();

  if (pedidoItem.id) {
    res.status(200).json(pedidoItem);
    return;
  }

  let erro = { id: id, erro: "Erro ao editar pedido." };
  res.status(400).json(erro);
};

export const deleteProductItem = async (req: Request, res: Response) => {
  let id = Number(req.params.id);
  let pedidoItem = new PedidoItem();

  pedidoItem.id = id;

  await pedidoItem.delete();

  let retorno = { okay: true };
  res.status(200).json(retorno);
};
