import puppeteer from "puppeteer";
import { dbQuery } from "./../database";
import * as nodemailer from "nodemailer";
import { PedidoItem } from "./PedidoItem";

export class Pedido {
  id: number = 0;
  situacao: number = 0;
  nome: string = "";
  cidade: string = "";
  siglaUf: string = "";
  formaPagamento: string = "";
  prazoPagamento: string = "";
  tipoFrete: string = "";
  observacoes: string = "";

  validate(): string[] {
    let errors: string[] = [];

    if (this.nome.trim().length === 0) {
      errors.push("Nome é obrigatório.");
    }
    if (this.cidade.trim().length === 0 || this.siglaUf.trim().length === 0) {
      errors.push("É necessário definir cidade e sigla.");
    }
    if (this.siglaUf.trim().length !== 2) {
      errors.push("Sigla deve conter 2 caracteres.");
    }
    if (this.formaPagamento.trim().length === 0) {
      errors.push("Forma de pagamento é obrigatória.");
    }
    if (this.prazoPagamento.trim().length === 0) {
      errors.push("Prazo de pagamento é obrigatório.");
    }
    if (this.tipoFrete.trim().length === 0) {
      errors.push("Tipo de frete é obrigatório.");
    }
    if (this.observacoes.length > 500) {
      errors.push("Observações não podem exceder 500 caracteres.");
    }

    return errors;
  }

  public async insert(): Promise<Pedido | null> {
    let sql = `INSERT INTO "pedido"
    (
    "nome",
    "situacao",
    "cidade",
    "siglaUf",
    "formaPagamento",
    "prazoPagamento",
    "tipoFrete",
    "observacoes"
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`;

    let params = [
      this.nome,
      this.situacao,
      this.cidade,
      this.siglaUf,
      this.formaPagamento,
      this.prazoPagamento,
      this.tipoFrete,
      this.observacoes,
    ];

    try {
      let resultado = await dbQuery(sql, params);
      if (resultado.length > 0) {
        this.id = resultado[0].id;
        return this;
      }
    } catch (error) {
      console.error("Error inserting Pedido:", error);
    }
    return null;
  }

  public async update(): Promise<Pedido | null> {
    let sql = `UPDATE pedido SET nome = $1, situacao = $2, cidade = $3, "siglaUf" = $4,
    "formaPagamento" = $5, "prazoPagamento" = $6, "tipoFrete" = $7, observacoes = $8
    WHERE id = $9`;

    let params = [
      this.nome,
      this.situacao,
      this.cidade,
      this.siglaUf,
      this.formaPagamento,
      this.prazoPagamento,
      this.tipoFrete,
      this.observacoes,
      this.id,
    ];

    try {
      let resultado = await dbQuery(sql, params);
      if (resultado) {
        return this;
      }
    } catch (error) {
      console.error("Error updating Pedido:", error);
    }
    return null;
  }

  public async save(): Promise<Pedido | null> {
    try {
      if (this.id) {
        return await this.update();
      } else {
        return await this.insert();
      }
    } catch (error) {
      console.error("Error saving Pedido:", error);
    }
    return null;
  }

  public async delete(): Promise<boolean | null> {
    let sql = `DELETE FROM pedido WHERE id = $1 RETURNING id;`;

    try {
      let resultado = await dbQuery(sql, [this.id]);
      if (resultado.length > 0) {
        this.id = resultado[0].id;
        return true;
      }
    } catch (error) {
      console.error("Error deleting Pedido:", error);
    }
    return false;
  }

  static async findOneById(id: number): Promise<Pedido | null> {
    let sql = `SELECT * FROM pedido WHERE id = $1 LIMIT 1;`;

    try {
      let resultado = await dbQuery(sql, [id]);
      if (resultado.length > 0) {
        let pedido = new Pedido();
        Object.assign(pedido, resultado[0]);
        return pedido;
      }
    } catch (error) {
      console.error("Error finding Pedido by id:", error);
    }
    return null;
  }

  public async listAll(): Promise<Pedido[]> {
    let sql = `SELECT
        *,
        (SELECT COUNT(*) FROM "pedidoItem" WHERE "pedidoItem"."idPedido" = "pedido".Id) AS "qtItem",
        (SELECT COALESCE(SUM("pedidoItem"."valorTotal"),0) FROM "pedidoItem" WHERE "pedidoItem"."idPedido" = "pedido".Id) AS "valorTotal"
        FROM "pedido"
        ORDER BY id`;
    let pedidos: Pedido[] = [];

    try {
      let result = await dbQuery(sql);
      for (let i = 0; i < result.length; i++) {
        let json = result[i];
        let pedido = new Pedido();
        Object.assign(pedido, json);
        pedidos.push(pedido);
      }
    } catch (error) {
      console.error("Error listing all Pedidos:", error);
    }

    return pedidos;
  }

  public async gerarPdf(html: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setContent(html);
    const pdfBuffer = await page.pdf();
    await page.close();
    await browser.close();
    return pdfBuffer;
  }

  public async pdf(idPedido: number) {
    let html = `
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
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Situação:</strong><span style="display: inline-block">${this.situacao}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Nome:</strong><span style="display: inline-block">${this.nome}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Forma de pagamento:</strong><span style="display: inline-block">${this.formaPagamento}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Prazo de pagamento:</strong><span style="display: inline-block">${this.prazoPagamento}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Tipo de frete:</strong><span style="display: inline-block">${this.tipoFrete}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Observações:</strong><span style="display: inline-block">${this.observacoes}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Sigla UF:</strong><span style="display: inline-block">${this.siglaUf}</span></div>
          <div style="margin-bottom: 15px"><strong style="display: inline-block; width: 200px">Cidade:</strong><span style="display: inline-block">${this.cidade}</span></div>
        </div>
          `;
    let pedidoItem = await PedidoItem.oneById(idPedido);

    if (pedidoItem.length > 0) {
      html += `
      <h1 style="text-align: center; color: #333; font-size: 24px">Items from order</h1>
       <table style="width: 100%; border-collapse: collapse; font-size: 16px; text-align: left;">
        <thead>
          <tr style="background-color: #333; ">
            <th style="padding: 12px 15px; border: 1px solid #ddd; color: #000; font-weight: bold;">Produto</th>
            <th style="padding: 12px 15px; border: 1px solid #ddd; color: #000; font-weight: bold;">Quantidade</th>
            <th style="padding: 12px 15px; border: 1px solid #ddd; color: #000; font-weight: bold;">Valor unitario</th>
            <th style="padding: 12px 15px; border: 1px solid #ddd; color: #000; font-weight: bold;">Valor total</th>
          </tr>
        </thead>
        <tbody>
      `;
      for (let index = 0; index < pedidoItem.length; index++) {
        const item = pedidoItem[index];

        html += `
        <tr style="border-bottom: 1px solid #ddd;"  >
          <td style="padding: 12px 15px; border: 1px solid #ddd;">${item.produto}</td>
          <td style="padding: 12px 15px; border: 1px solid #ddd;">${item.quantidade}</td>
          <td style="padding: 12px 15px; border: 1px solid #ddd;">${item.valorUnitario}</td>
          <td style="padding: 12px 15px; border: 1px solid #ddd;">${item.valorTotal}</td>
          </tr>
          `;
      }
    }
    html += `
      </tbody>
   </table>
      </body>
      </html>`;
    return await this.gerarPdf(html);
  }

  public async email() {
    try {
      let emailConfig = {
        host: "smtp.mailersend.net",
        port: 587,
        auth: {
          user: "MS_q2H7LQ@trial-v69oxl5n95dl785k.mlsender.net",
          pass: "GDHsGziMsC9hEjkx",
        },
      };

      await Pedido.findOneById(this.id);

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
        <span style="display: inline-block">${this.situacao}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px">Nome:</strong>
        <span style="display: inline-block">${this.nome}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px"
          >Forma de pagamento:</strong
        >
        <span style="display: inline-block">${this.formaPagamento}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px"
          >Prazo de pagamento:</strong
        >
        <span style="display: inline-block">${this.prazoPagamento}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px"
          >Tipo de frete:</strong
        >
        <span style="display: inline-block">${this.tipoFrete}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px"
          >Observações:</strong
        >
        <span style="display: inline-block">${this.observacoes}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px">Sigla UF:</strong>
        <span style="display: inline-block">${this.siglaUf}</span>
      </div>

      <div style="margin-bottom: 15px">
        <strong style="display: inline-block; width: 200px">Cidade:</strong>
        <span style="display: inline-block">${this.cidade}</span>
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

      return await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error when sending email:", error);
      return { erro: "Erro ao mandar email." };
    }
  }
}
