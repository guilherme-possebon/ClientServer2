async function ListAllOrders() {
  try {
    let result = await myGet("/pedido");

    if (!result.ok) {
      throw new Error("Erro ao obter pedidos: " + result.status);
    }

    let pedidos = await result.json();

    let html = "";

    for (let index = 0; index < pedidos.length; index++) {
      let pedido = pedidos[index];

      if (!pedido) {
        continue;
      }

      switch (pedido.situacao) {
        case 0:
          pedido.situacao = "Cancelado";
          break;
        case 10:
          pedido.situacao = "Emitido";
          break;
        case 20:
          pedido.situacao = "Pago";
          break;
        case 30:
          pedido.situacao = "Enviado";
          break;
        case 40:
          pedido.situacao = "Entregue";
          break;
        case 50:
          pedido.situacao = "Concluído";
          break;
      }

      let excluir = `<button onclick="deleteOrder(${pedido.id})">Excluir</button>`;
      let editar = `<button onclick="editOrder(${pedido.id})">Editar</button>`;

      html += `
        <tr>
            <td>${excluir}<br/>${editar}<br/></td>
            <td>${pedido.id}</td>
            <td>${pedido.situacao}</td>
            <td>${pedido.nome}</td>
            <td>${pedido.cidade}</td>
            <td>${pedido.siglaUf}</td>
            <td>${pedido.formaPagamento}</td>
            <td>${pedido.prazoPagamento}</td>
            <td>${pedido.tipoFrete}</td>
            <td>${pedido.observacoes}</td>
            <td>${pedido.qtItem}</td>
            <td>${RealFormat(pedido.valorTotal)}</td>
        </tr>
        `;
    }

    document.getElementById("tbodyPedidos").innerHTML = html;
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    alert("Erro ao listar pedidos: " + error.message);
  }
}

async function loadOrder() {
  let id = getParam("id");

  if (id != null) {
    document.getElementById("h1").innerHTML = "Editar pedido";

    let result = await myGet("/pedido/" + id);

    let json = await result.json();
    document.getElementById("situacao").value = json.situacao;
    document.getElementById("nome").value = json.nome;
    document.getElementById("formaPagamento").value = json.formaPagamento;
    document.getElementById("prazoPagamento").value = json.prazoPagamento;
    document.getElementById("tipoFrete").value = json.tipoFrete;
    document.getElementById("observacoes").value = json.observacoes;
    setSelectValue("siglaUf", json.siglaUf);
    await loadCities();
    setSelectValue("cidade", json.cidade);
    setSelectValue("situacao", json.situacao);
  }
}

async function saveOrders() {
  let id = getParam("id");
  let method = id == null ? "POST" : "PUT";
  let url = id == null ? "/pedido" : "/pedido/" + id;

  const pedido = {
    situacao: document.getElementById("situacao").value,
    nome: document.getElementById("nome").value,
    cidade: document.getElementById("cidade").value,
    siglaUf: document.getElementById("siglaUf").value,
    formaPagamento: document.getElementById("formaPagamento").value,
    prazoPagamento: document.getElementById("prazoPagamento").value,
    tipoFrete: document.getElementById("tipoFrete").value,
    observacoes: document.getElementById("observacoes").value,
  };

  try {
    let result = await myPost(url, method, pedido);

    if (result.ok) {
      alert("Pedido salvo com sucesso!");
      window.location = "pedidos.html";
    } else {
      alert("Erro inesperado: " + result.status);
    }
  } catch (error) {
    alert("Erro ao se conectar com o servidor: " + error.message);
  }
}

async function deleteOrder(id) {
  if (confirm("Deseja realmente excluir?")) {
    let result = await myGet("/pedido/" + id, "DELETE");

    if (result.ok) {
      alert("Pedido excluido com sucesso!");
      ListAllOrders();
    } else {
      alert("Problemas ao excluir o pedido");
    }
  }
}

async function editOrder(id) {
  window.location = "adicionarpedido.html?id=" + id;
}
