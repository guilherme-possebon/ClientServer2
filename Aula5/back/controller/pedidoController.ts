import { Request, Response } from "express";
import { Pedido } from "../model/pedido";
import * as nodemailer from "nodemailer";
import * as fs from "fs";

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    let pedido = new Pedido();
    let result = await pedido.listAll();
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ erro: "Erro ao buscar produtos." });
    return;
  }
};

export const getOneByIdProduct = async (req: Request, res: Response) => {
  try {
    let id = Number(req.params.id);
    let pedido = await Pedido.findOneById(id);

    if (pedido != null) {
      res.status(200).json(pedido);
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
    let pedido = await Pedido.findOneById(id);

    if (pedido == null) {
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

export const getProductCsv = async (req: Request, res: Response) => {
  try {
    let pedido = new Pedido();
    let dados = await pedido.listAll();
    let header =
      '"Id";"Situação";"Nome";"Cidade";"Sigla UF";"Forma de pagamento";"Prazo de pagamento";"Tipo do frete";"Observações";"Quantidade de itens";"Valor total"\r\n';
    let csv = header;

    for (let idx in dados) {
      let pedido = dados[idx];
      csv +=
        '"' +
        pedido.id +
        '";"' +
        pedido.situacao +
        '";"' +
        pedido.nome +
        '";"' +
        pedido.cidade +
        '";"' +
        pedido.siglaUf +
        '";"' +
        pedido.formaPagamento +
        '";"' +
        pedido.prazoPagamento +
        '";"' +
        pedido.tipoFrete +
        '";"' +
        pedido.observacoes +
        '"\r\n';
    }

    res.append("Content-Type", "text/csv");
    res.attachment("pedido.csv");
    res.status(200).send(csv);
    return;
  } catch (error) {
    console.error("Error download csv: ", error);
    res.status(500).json({ erro: "Erro ao baixar o csv" });
    return;
  }
};

export const getProductEmail = async (req: Request, res: Response) => {
  let idPedido = Number(req.params.id);
  let pedido = await Pedido.findOneById(idPedido);

  if (pedido == null) {
    res.status(400).json({ erro: "Impossível encontrar pedido " + idPedido });
  } else {
    let result = await pedido.email();
  }
};

export const getProductPdf = async (req: Request, res: Response) => {
  let idPedido = Number(req.params.id);
  let pedido = await Pedido.findOneById(idPedido);

  if (pedido == null) {
    res.status(400).json({ erro: "Impossível encontrar pedido " + idPedido });
  } else {
    let pdfBuffer = await pedido.pdf(idPedido);

    fs.writeFileSync("output.pdf", pdfBuffer);
    let file = fs.createReadStream("output.pdf");
    let stat = fs.statSync("output.pdf");
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/pdf");
    file.pipe(res);
  }
};
