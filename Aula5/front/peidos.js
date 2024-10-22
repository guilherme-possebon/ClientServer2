async function ListAllOrders() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    let result = await fetch(apiUrl + "/pedido", requestOptions);

    if (!result.ok) {
      throw new Error("Erro ao obter pedidos: " + result.status);
    }

    let json = await result.json();
    console.log(json);

    let html = "";

    for (let index = 0; index < json.length; index++) {
      const pedido = json[index];
      console.log(pedido);
      html += `
          <tr>
            <td>${pedido.id}</td>
            <td>${pedido.situacao}</td>
            <td>${pedido.nome}</td>
            <td>${pedido.cidade}</td>
            <td>${pedido.formaPagamento}</td>
            <td>${pedido.prazoPagamento}</td>
            <td>${pedido.tipoFrete}</td>
            <td>${pedido.observacoes}</td>
            <td>${pedido.siglaUf}</td>
          </tr>
      `;
    }

    document.getElementById("tbody").innerHTML = html;
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    alert("Erro ao listar pedidos: " + error.message);
  }
}
