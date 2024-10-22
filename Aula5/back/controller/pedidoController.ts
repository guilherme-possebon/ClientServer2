import { Request, Response } from "express";
import { Pedido } from "../model/pedido";

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    let pedido = new Pedido();
    let result = await pedido.listAll();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ erro: "Erro ao buscar produtos." });
  }
};

export const getOneByIdProduct = async (req: Request, res: Response) => {
  try {
    let id = Number(req.params.id);
    let pedido = new Pedido();
    let result = await pedido.findOneById(id);

    if (result != null) {
      res.status(200).json(result);
      return;
    }

    let erro = { id: id, erro: "Pedido não encontrado." };
    res.status(400).json(erro);
  } catch (error) {
    console.error("Error fetching product by id:", error);
    res.status(500).json({ erro: "Erro ao buscar pedido." });
  }
};

export const insertProduct = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ erro: "Erro ao inserir pedido." });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
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

    let erro = { id: id, erro: "Erro ao editar pedido." };
    res.status(400).json(erro);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ erro: "Erro ao editar pedido." });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    let id = Number(req.params.id);
    let pedido = new Pedido();
    pedido.id = id;

    await pedido.delete();

    res.status(200).json({ okay: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ erro: "Erro ao deletar pedido." });
  }
};
