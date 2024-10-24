import { Pedido } from "../model/pedido";

async function testPedidoInsert() {
  let pedido = new Pedido();
  pedido.nome = "Guilherme Possebon";
  pedido.situacao = 50;
  pedido.cidade = "Muçum";
  pedido.siglaUf = "RS";
  pedido.formaPagamento = "PIX";
  pedido.prazoPagamento = "A vista";
  pedido.tipoFrete = "Correio PAC";
  pedido.observacoes = "Entregar depois das 9h";
  await pedido.save();

  if (!pedido.id) {
    console.log("Falha INSERT");
  } else {
    console.log("INSERT feito com sucesso!");
  }
}

async function testPedidoUpdate() {
  let pedido = new Pedido();
  pedido.id = 1;
  pedido.nome = "Guilherme Edit";
  pedido.situacao = 200;
  pedido.cidade = "Dois lajeados";
  pedido.siglaUf = "RS";
  pedido.formaPagamento = "Crédito";
  pedido.prazoPagamento = "A prazo";
  pedido.tipoFrete = "Correio PAC";
  pedido.observacoes = "Entregar depois das 12h";

  await pedido.save();

  if (pedido == null) {
    console.log("Falha no UPDATE");
  } else {
    console.log("UPDATE feito com sucesso!");
  }
}

async function testPedidoDelete() {
  let pedido = new Pedido();

  pedido.id = 3;

  let result = await pedido.delete();

  if (!result) {
    console.log("Falha no DELETE");
  } else {
    console.log("DELETE feito com sucesso!");
  }
}

async function testPedidoSelectOne() {
  let pedido = new Pedido();

  let result = await pedido.findOneById(1);

  if (result == null) {
    console.log("Id não encontrado");
  } else {
    console.log("FindOneById feito com sucesso!");
  }
}

async function testPedidoFindAll() {
  let pedido = new Pedido();

  let result = await pedido.listAll();

  console.log(result);
}

testPedidoInsert();
testPedidoDelete();
testPedidoFindAll();
testPedidoUpdate();
testPedidoSelectOne();
