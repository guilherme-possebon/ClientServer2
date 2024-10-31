CREATE TABLE "pedido" (
	"id" SERIAL NOT NULL,
	"situacao" INTEGER NOT NULL,
	"nome" VARCHAR(200) NOT NULL,
	"cidade" VARCHAR(100) NOT NULL,
	"formaPagamento" VARCHAR(100) NULL DEFAULT NULL,
	"prazoPagamento" VARCHAR(100) NULL DEFAULT NULL,
	"tipoFrete" VARCHAR(100) NULL DEFAULT NULL,
	"observacoes" TEXT NULL DEFAULT NULL,
	"siglaUf" VARCHAR(2) NOT NULL,
	PRIMARY KEY ("id")
)
;

CREATE TABLE "pedidoItem" (
	"id" SERIAL NOT NULL,
	"idPedido" INTEGER NOT NULL,
	"produto" VARCHAR(200) NOT NULL,
	"quantidade" INTEGER NOT NULL,
	"valorUnitario" NUMERIC(10,2) NOT NULL,
	"valorTotal" NUMERIC(10,2) NULL DEFAULT NULL,
	PRIMARY KEY ("id"),
	CONSTRAINT "pedidoItem_idPedido_fkey" FOREIGN KEY ("idPedido") REFERENCES "pedido" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
)
;

CREATE TABLE "usuario" (
	"id" SERIAL NOT NULL,
	"username" VARCHAR(255) NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	PRIMARY KEY ("id")
)
;
