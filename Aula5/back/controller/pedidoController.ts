import { Request, Response } from "express";
import { Pedido } from "../model/pedido";
import * as nodemailer from "nodemailer";
import * as fs from "fs";
import puppeteer from "puppeteer";

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
    console.log("Error download csv: ", error);
    res.status(500).json({ erro: "Erro ao baixar o csv" });
    return;
  }
};

export const getProductEmail = async (req: Request, res: Response) => {
  try {
    let id = Number(req.params.id);
    let emailConfig = {
      host: "smtp.mailersend.net",
      port: 587,
      auth: {
        user: "MS_q2H7LQ@trial-v69oxl5n95dl785k.mlsender.net",
        pass: "GDHsGziMsC9hEjkx",
      },
    };

    let pedido = new Pedido();

    let result = await pedido.findOneById(id);

    console.log(result);

    let html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Details</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      padding: 20px;
      line-height: 1.6;
      background-color: #f9f9f9;
      color: #333;
    "
  >
    <div
      style="
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #fff;
      "
    >
      <h1 style="text-align: center; color: #333; font-size: 24px">
        Order Details
      </h1>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px">Situação:</strong>
        <span style="display: inline-block">${result?.situacao}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px">Nome:</strong>
        <span style="display: inline-block">${result?.nome}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px"
          >Forma de pagamento:</strong
        >
        <span style="display: inline-block">${result?.formaPagamento}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px"
          >Prazo de pagamento:</strong
        >
        <span style="display: inline-block">${result?.prazoPagamento}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px"
          >Tipo de frete:</strong
        >
        <span style="display: inline-block">${result?.tipoFrete}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px"
          >Observações:</strong
        >
        <span style="display: inline-block">${result?.observacoes}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px">Sigla UF:</strong>
        <span style="display: inline-block">${result?.siglaUf}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px">Cidade:</strong>
        <span style="display: inline-block">${result?.cidade}</span>
      </div>
    </div>
  </body>
</html>

    `;

    let mailOptions = {
      from: "teste@trial-v69oxl5n95dl785k.mlsender.net",
      to: "guilhermepossebon06@gmail.com",
      subject: "Estou enviando um email pelo TS",
      html: html,
    };

    let transporter = nodemailer.createTransport(emailConfig);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Erro ao enviar email: " + error);
      } else {
        console.log("Email enviado: " + info.response);
      }
    });

    res.status(200).json({ okay: true });
  } catch (error) {
    console.error("Error when sending email:", error);
    res.status(500).json({ erro: "Erro ao mandar email." });
  }
};

export const getProductPdf = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const pedido = new Pedido();
    const result = await pedido.findOneById(id);

    if (!result) {
      res.status(404).json({ erro: "Pedido não encontrado." });
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Details</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
          <h1 style="text-align: center; color: #333; font-size: 24px">Order Details</h1>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Situação:</strong><span style="display: inline-block">${result.situacao}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Nome:</strong><span style="display: inline-block">${result.nome}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Forma de pagamento:</strong><span style="display: inline-block">${result.formaPagamento}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Prazo de pagamento:</strong><span style="display: inline-block">${result.prazoPagamento}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Tipo de frete:</strong><span style="display: inline-block">${result.tipoFrete}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Observações:</strong><span style="display: inline-block">${result.observacoes}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Sigla UF:</strong><span style="display: inline-block">${result.siglaUf}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Cidade:</strong><span style="display: inline-block">${result.cidade}</span></div>
        </div>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    await page.close();
    await browser.close();

    res.append("Content-Type", "application/pdf");
    res.attachment("pedido.pdf");
    res.status(200).send(pdfBuffer);
    return;
  } catch (error) {
    console.error("Error when downloading pdf:", error);
    res.status(500).json({ erro: "Erro ao baixar pdf." });
  }
};
