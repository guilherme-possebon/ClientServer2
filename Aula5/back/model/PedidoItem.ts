import { dbQuery } from "./../database";

export class PedidoItem {
  id: number = 0;
  idPedido: number = 0;
  produto: string = "";
  quantidade: number = 0;
  valorUnitario: number = 0;
  valorTotal: number = 0;

  validate(): string[] {
    let errors: string[] = [];

    if (this.produto.trim().length === 0) {
      errors.push("Produto é obrigatório.");
    }

    if (this.quantidade <= 0) {
      errors.push("Quantidade deve ser maior que zero.");
    }

    if (this.valorUnitario <= 0) {
      errors.push("Valor unitário deve ser maior que zero.");
    }

    if (this.valorTotal <= 0) {
      errors.push("Valor total deve ser maior que zero.");
    }

    if (this.idPedido <= 0) {
      errors.push("ID do pedido é obrigatório e deve ser maior que zero.");
    }

    return errors;
  }

  public async insert(): Promise<PedidoItem | null> {
    let sql = `INSERT INTO "pedidoItem"
    (
      "idPedido",
      "produto",
      "quantidade",
      "valorUnitario",
      "valorTotal"
    )
    VALUES ($1, $2, $3, $4, $5) RETURNING id`;

    let params = [
      this.idPedido,
      this.produto,
      this.quantidade,
      this.valorUnitario,
      this.valorTotal,
    ];

    try {
      let resultado = await dbQuery(sql, params);
      if (resultado.length > 0) {
        this.id = resultado[0].id;
        return this;
      }
    } catch (error) {
      console.error("Error inserting PedidoItem:", error);
    }
    return null;
  }

  public async update(): Promise<PedidoItem | null> {
    let sql = `UPDATE "pedidoItem"
    SET
        "produto" = $1,
        "quantidade" = $2,
        "valorUnitario" = $3,
    WHERE id = $4`;

    let params = [this.produto, this.quantidade, this.valorUnitario, this.id];

    try {
      let resultado = await dbQuery(sql, params);
      if (resultado) {
        return this;
      }
    } catch (error) {
      console.error("Error updating PedidoItem:", error);
    }
    return null;
  }

  public async save(): Promise<PedidoItem | null> {
    try {
      if (this.id) {
        return await this.update();
      } else {
        return await this.insert();
      }
    } catch (error) {
      console.error("Error saving PedidoItem:", error);
    }
    return null;
  }

  public async delete(): Promise<boolean | null> {
    let sql = `DELETE FROM "pedidoItem" WHERE id = $1 RETURNING id;`;

    try {
      let resultado = await dbQuery(sql, [this.id]);
      if (resultado.length > 0) {
        this.id = resultado[0].id;
        return true;
      }
    } catch (error) {
      console.error("Error deleting PedidoItem:", error);
    }
    return false;
  }

  public async findOneById(id: number): Promise<PedidoItem | null> {
    let sql = `SELECT * FROM "pedidoItem" WHERE id = $1 LIMIT 1;`;

    try {
      let resultado = await dbQuery(sql, [id]);
      if (resultado.length > 0) {
        let pedidoItem = new PedidoItem();
        Object.assign(pedidoItem, resultado[0]);
        return pedidoItem;
      }
    } catch (error) {
      console.error("Error finding PedidoItem by id:", error);
    }
    return null;
  }

  public async listAll(): Promise<PedidoItem[]> {
    let sql = `SELECT * FROM "pedidoItem" ORDER BY id`;
    let pedidoItens: PedidoItem[] = [];

    try {
      let result = await dbQuery(sql);
      for (let i = 0; i < result.length; i++) {
        let json = result[i];
        let pedidoItem = new PedidoItem();
        Object.assign(pedidoItem, json);
        pedidoItens.push(pedidoItem);
      }
    } catch (error) {
      console.error("Error listing all PedidoItens:", error);
    }

    return pedidoItens;
  }

  public async oneById(id: number): Promise<PedidoItem[]> {
    let sql = `SELECT * FROM "pedidoItem" where "idPedido" = $1 ORDER BY id`;
    let pedidoItens: PedidoItem[] = [];

    console.log(id);

    try {
      let result = await dbQuery(sql, [id]);
      for (let i = 0; i < result.length; i++) {
        let json = result[i];
        let pedidoItem = new PedidoItem();
        Object.assign(pedidoItem, json);
        pedidoItens.push(pedidoItem);
      }
    } catch (error) {
      console.error("Error listing all PedidoItens:", error);
    }

    return pedidoItens;
  }
}
