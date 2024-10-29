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
    console.error("Falha INSERT");
  } else {
    console.error("INSERT feito com sucesso!");
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
    console.error("Falha no UPDATE");
  } else {
    console.error("UPDATE feito com sucesso!");
  }
}

async function testPedidoDelete() {
  let pedido = new Pedido();

  pedido.id = 3;

  let result = await pedido.delete();

  if (!result) {
    console.error("Falha no DELETE");
  } else {
    console.error("DELETE feito com sucesso!");
  }
}

async function testPedidoSelectOne() {
  let result = await Pedido.findOneById(1);

  if (result == null) {
    console.error("Id não encontrado");
  } else {
    console.error("FindOneById feito com sucesso!");
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
