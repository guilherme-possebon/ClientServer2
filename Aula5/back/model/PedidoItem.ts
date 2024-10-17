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

    // Validate 'produto'
    if (this.produto.trim().length === 0) {
      errors.push("Produto é obrigatório.");
    }

    // Validate 'quantidade' (should be greater than 0)
    if (this.quantidade <= 0) {
      errors.push("Quantidade deve ser maior que zero.");
    }

    // Validate 'valorUnitario' (should be greater than 0)
    if (this.valorUnitario <= 0) {
      errors.push("Valor unitário deve ser maior que zero.");
    }

    // Validate 'valorTotal' (should be greater than 0)
    if (this.valorTotal <= 0) {
      errors.push("Valor total deve ser maior que zero.");
    }

    // Validate 'idPedido' (should be greater than 0 if it's required)
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

    let resultado = await dbQuery(sql, params);

    if (resultado.length > 0) {
      this.id = resultado[0].id;
      return this;
    }

    return null;
  }

  public async update(): Promise<PedidoItem | null> {
    let sql = `UPDATE "pedidoItem"
    SET
        "idPedido" = $1,
        "produto" = $2,
        "quantidade" = $3,
        "valorUnitario" = $4,
        "valorTotal" = $5
    WHERE id = $6`;

    let params = [
      this.idPedido,
      this.produto,
      this.quantidade,
      this.valorUnitario,
      this.valorTotal,
      this.id,
    ];

    let resultado = await dbQuery(sql, params);

    if (resultado) {
      return this;
    }

    return null;
  }

  public async save(): Promise<PedidoItem | null> {
    if (this.id) {
      return await this.update();
    }

    return await this.insert();
  }

  public async delete(): Promise<boolean | null> {
    let sql = `DELETE FROM
        "pedidoItem" WHERE id = $1
        RETURNING id;`;

    let resultado = await dbQuery(sql, [this.id]);

    if (resultado.length > 0) {
      this.id = resultado[0].id;
      return true;
    }

    return false;
  }

  public async findOneById(id: number): Promise<PedidoItem | null> {
    let sql = `SELECT * FROM "pedidoItem"
        WHERE id = $1 LIMIT 1;`;

    let resultado = await dbQuery(sql, [id]);

    if (resultado.length > 0) {
      let pedidoItem = new PedidoItem();
      Object.assign(pedidoItem, resultado[0]);
      return pedidoItem;
    }

    return null;
  }

  public async listAll(): Promise<PedidoItem[]> {
    let sql = `SELECT * FROM "pedidoItem" ORDER BY id`;
    let result = await dbQuery(sql);
    let pedidoItens: PedidoItem[] = [];

    for (let i = 0; i < result.length; i++) {
      let json = result[i];
      let pedidoItem = new PedidoItem();
      Object.assign(pedidoItem, json);
      pedidoItens.push(pedidoItem);
    }

    return pedidoItens;
  }
}
