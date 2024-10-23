async function listItems() {
  let id = getParam("id");

  let result = await myGet("/pedidoitem/pedido/" + id, "GET");
  let json = await result.json();

  let html = "";

  for (let index = 0; index < json.length; index++) {
    const item = json[index];

    let excluir = `<button onclick="deleteItem(${item.id})">Excluir</button>`;
    let editar = `<button onclick="loadEditedItem(${item.id})">Editar</button>`;

    html += `
        <tr>
            <td>${excluir} ${editar}</td>
            <td>${item.id}</td>
            <td>${item.produto}</td>
            <td>${item.quantidade}</td>
            <td>${item.valorUnitario}</td>
            <td>${item.valorTotal}</td>
        </tr>
    `;

    document.getElementById("tbodyItem").innerHTML = html;
  }
}

async function saveItem() {
  let id = getParam("id");
  let method = id == null ? "POST" : "PUT";
  let url = id == null ? "/pedidoitem" : "/pedidoitem/" + id;

  let item = {
    nomeProduto: document.getElementById("nomeProduto").value,
    quantidade: document.getElementById("quantidade").value,
    valorUnitario: document.getElementById("valorUnitario").value,
  };

  try {
    let result = await myPost(url, method, item);

    if (result.ok) {
      alert("Item salvo com sucesso!");

      document.getElementById("nomeProduto").value = "";
      document.getElementById("quantidade").value = null;
      document.getElementById("valorUnitario").value = "";

      listItems();
    } else {
      alert("Erro inesperado: " + result.status);
    }
  } catch (error) {
    alert("Erro ao se conectar com o servidor: " + error.message);
  }
}

async function loadEditedItem(id) {
  if (id !== null) {
    let result = await myGet("/pedidoitem/" + id);
    let item = await result.json();

    console.log(item.produto);
    console.log(item.quantidade);
    console.log(item.valorUnitario);

    document.getElementById("nomeProduto").value = item.produto;
    document.getElementById("quantidade").value = item.quantidade;
    document.getElementById("valorUnitario").value = item.valorUnitario;
  }
}
