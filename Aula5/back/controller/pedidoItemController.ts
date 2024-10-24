import { Request, Response } from "express";
import { PedidoItem } from "../model/pedidoItem";

export const getAllProductItem = async (req: Request, res: Response) => {
  try {
    let pedidoItem = new PedidoItem();
    let result = await pedidoItem.listAll();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching all product items:", error);
    res.status(500).json({ erro: "Erro ao buscar itens do pedido." });
  }
};

export const getOneProductItem = async (req: Request, res: Response) => {
  let id = Number(req.params.idPedido);
  try {
    console.log(id);
    let pedidoItem = new PedidoItem();
    let result = await pedidoItem.oneById(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching all product items:", error);
    res.status(500).json({ erro: "Erro ao buscar itens do pedido." });
  }
};

export const getOneByIdProductItem = async (req: Request, res: Response) => {
  try {
    let id = Number(req.params.id);
    let pedidoItem = new PedidoItem();
    let result = await pedidoItem.findOneById(id);

    if (result != null) {
      res.status(200).json(result);
      return;
    }

    let erro = { id: id, erro: "Item do pedido não encontrado." };
    res.status(400).json(erro);
  } catch (error) {
    console.error("Error fetching product item by id:", error);
    res.status(500).json({ erro: "Erro ao buscar item do pedido." });
  }
};

export const insertProductItem = async (req: Request, res: Response) => {
  try {
    let pedidoItem = new PedidoItem();

    pedidoItem.idPedido = req.body.idPedido;
    pedidoItem.produto = req.body.produto;
    pedidoItem.quantidade = req.body.quantidade;
    pedidoItem.valorUnitario = req.body.valorUnitario;

    console.log(pedidoItem);
    let erros: string[] = pedidoItem.validate();

    if (erros.length > 0) {
      res.status(400).json({ erros: erros });
      return;
    }

    await pedidoItem.save();

    if (pedidoItem.id) {
      res.status(200).json(pedidoItem);
      return;
    }

    res.status(400).json({ erro: "Erro ao inserir item do pedido." });
  } catch (error) {
    console.error("Error inserting product item:", error);
    res.status(500).json({ erro: "Erro ao inserir item do pedido." });
  }
};

export const updateProductItem = async (req: Request, res: Response) => {
  try {
    let id = Number(req.params.id);
    let pedidoItem = new PedidoItem();

    let result = await pedidoItem.findOneById(id);

    if (result == null) {
      res.status(400).json({ id: id, erro: "Item do pedido não encontrado." });
      return;
    }

    pedidoItem.id = id;
    pedidoItem.idPedido = req.body.idPedido;
    pedidoItem.produto = req.body.produto;
    pedidoItem.quantidade = req.body.quantidade;
    pedidoItem.valorUnitario = req.body.valorUnitario;
    pedidoItem.valorTotal = req.body.valorTotal;

    let erros: string[] = pedidoItem.validate();

    if (erros.length > 0) {
      res.status(400).json({ erros: erros });
      return;
    }

    await pedidoItem.save();

    if (pedidoItem.id) {
      res.status(200).json(pedidoItem);
      return;
    }

    res.status(400).json({ id: id, erro: "Erro ao editar item do pedido." });
  } catch (error) {
    console.error("Error updating product item:", error);
    res.status(500).json({ erro: "Erro ao editar item do pedido." });
  }
};

export const deleteProductItem = async (req: Request, res: Response) => {
  try {
    let id = Number(req.params.id);
    let pedidoItem = new PedidoItem();
    pedidoItem.id = id;

    await pedidoItem.delete();

    res.status(200).json({ okay: true });
  } catch (error) {
    console.error("Error deleting product item:", error);
    res.status(500).json({ erro: "Erro ao deletar item do pedido." });
  }
};
