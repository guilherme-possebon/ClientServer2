create table "pedido" (
    "id" serial,
    "situação" int NOT NULL,
    "nome" varchar(200) NOT NULL,
    "cidade" varchar(100) NOT NULL,
    "siglaUf" varchar(2) NOT NULL,
    "formaPagamento" varchar(100) NULL,
    "prazoPagamento" varchar(100) NULL,
    "tipoFrete" varchar(100) NULL,
    "observacoes" text NULL,
    primary key(id)
);

create TABLE "pedidoItem" (
    "id" serial,
    "idPedido" int NOT NULL,
    "produto" varchar(200) NOT NULL,
    "quantidade" int NOT NULL,
    "valorUnitario" decimal(10,2) NOT NULL,
    "valorTotal" decimal(10,2) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY("idPedido") REFERENCES pedido(id)
);
