import { Pedido } from "../model/pedido";
import { PedidoItem } from "../model/pedidoItem";

async function testPedido() {
  let pedido = new Pedido();
  pedido.nome = "Guilherme Possebon";
  pedido.situacao = 50;
  pedido.cidade = "Muçum";
  pedido.siglaUf = "RS";
  pedido.formaPagamento = "PIX";
  pedido.prazoPagamento = "A prazo";
  pedido.tipoFrete = "Correio PAC";
  pedido.observacoes = "Entregar depois das 19h";
  await pedido.insert();

  console.log("INSERT com sucesso!");

  let item = new PedidoItem();
  item.idPedido = pedido.id;
  item.produto = "Bala";
  item.quantidade = 2;
  item.valorUnitario = 1;
  item.valorTotal = 2;
  item.insert();
}

testPedido();
