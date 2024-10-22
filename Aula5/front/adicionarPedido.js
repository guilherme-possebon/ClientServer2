async function saveOrders() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    situacao: document.getElementById("situacao").value,
    nome: document.getElementById("nome").value,
    cidade: document.getElementById("cidade").value,
    siglaUf: document.getElementById("siglaUf").value,
    formaPagamento: document.getElementById("formaPagamento").value,
    prazoPagamento: document.getElementById("prazoPagamento").value,
    tipoFrete: document.getElementById("tipoFrete").value,
    observacoes: document.getElementById("observacoes").value,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    let result = await fetch(apiUrl + "/pedido/", requestOptions);

    if (result.ok) {
      alert("Pedido salvo com sucesso!");
    } else {
      alert("Erro inesperado: " + result.status);
    }
  } catch (error) {
    alert("Erro ao se conectar com o servidor: " + error.message);
  }
}
