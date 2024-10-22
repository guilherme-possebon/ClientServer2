import { client, dbQuery } from "./../database";

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

  public async findOneById(id: number): Promise<Pedido | null> {
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
}
