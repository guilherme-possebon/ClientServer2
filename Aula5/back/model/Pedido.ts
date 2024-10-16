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

    // Validate 'nome'
    if (this.nome.trim().length === 0) {
      errors.push("Nome é obrigatório.");
    }

    // Validate 'cidade' and 'siglaUf'
    if (this.cidade.trim().length === 0 || this.siglaUf.trim().length === 0) {
      errors.push("É necessário definir cidade e sigla.");
    }

    // Validate 'siglaUf' length (assuming it should be 2 characters)
    if (this.siglaUf.trim().length !== 2) {
      errors.push("Sigla deve conter 2 caracteres.");
    }

    // Validate 'formaPagamento'
    if (this.formaPagamento.trim().length === 0) {
      errors.push("Forma de pagamento é obrigatória.");
    }

    // Validate 'prazoPagamento'
    if (this.prazoPagamento.trim().length === 0) {
      errors.push("Prazo de pagamento é obrigatório.");
    }

    // Validate 'tipoFrete'
    if (this.tipoFrete.trim().length === 0) {
      errors.push("Tipo de frete é obrigatório.");
    }

    // Optional: Validate 'observacoes' length (if there is a max length limit, e.g., 500 characters)
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

    let resultado = await dbQuery(sql, params);

    if (resultado.length > 0) {
      this.id = resultado[0].id;
      return this;
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

    let resultado = await dbQuery(sql, params);

    if (resultado) {
      return this;
    }

    return null;
  }

  public async save(): Promise<Pedido | null> {
    if (this.id) {
      return await this.update();
    }

    return await this.insert();
  }

  public async delete(): Promise<boolean | null> {
    let sql = `DELETE FROM
        pedido WHERE id = $1
        RETURNING id;`;

    let resultado = await dbQuery(sql, [this.id]);

    if (resultado.length > 0) {
      this.id = resultado[0].id;
      return true;
    }

    return false;
  }

  public async findOneById(id: number): Promise<Pedido | null> {
    let sql = `SELECT * FROM pedido
        WHERE id = $1 LIMIT 1;`;

    let resultado = await dbQuery(sql, [id]);

    if (resultado.length > 0) {
      let pedido = new Pedido();
      Object.assign(pedido, resultado[0]);
      return pedido;
    }

    return null;
  }

  public async listAll(): Promise<Pedido[]> {
    let sql = `SELECT * FROM pedido ORDER BY id`;
    let result = await dbQuery(sql);
    let pedidos: Pedido[] = [];

    for (let i = 0; i < result.length; i++) {
      let json = result[i];
      let pedido = new Pedido();
      Object.assign(pedido, json);
      pedidos.push(pedido);
    }

    return pedidos;
  }
}
