const apiUrl = "http://localhost:3000";

let authorization = localStorage.getItem("Authorization");

async function execute() {
  let response = await fetch("http://localhost:3000/", {
    credentials: "include",
  });

  let json = await response.json();

  console.log(json);
}

async function verificaLogin() {
  let resultado = await buscarLogin(authorization);

  if (!resultado) {
    window.location = "login.html";
  }
}

async function buscarLogin(authorization) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authorization);

  const options = {
    method: "GET",
    headers: myHeaders,
  };

  let result = await fetch(apiUrl + "/login", options);
  let json = await result.json();

  if (result.ok) {
    return true;
  }

  return false;
}

function logout() {
  localStorage.removeItem("Authorization");

  window.location = "login.html";
}

async function login() {
  let user = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let authorization = btoa(user + ":" + password);
  let result = await buscarLogin(authorization);

  if (result) {
    localStorage.setItem("Authorization", authorization);
    alert("Login ok");
    window.location = "pedidos.html";
  } else {
    alert("Falha no login!");
  }
}

async function loadStates() {
  try {
    let resultStates = await fetch("https://brasilapi.com.br/api/ibge/uf/v1");

    if (!resultStates.ok) {
      throw new Error("Erro ao carregar estados: " + resultStates.status);
    }

    let states = await resultStates.json();
    let html = "";

    for (let index = 0; index < states.length; index++) {
      const state = states[index];

      html += `
          <option value="${state.sigla}">${state.sigla} - ${state.nome}</option>
      `;
    }

    document.getElementById("siglaUf").innerHTML += html;
  } catch (error) {
    console.error("Erro ao carregar estados:", error);
    alert("Erro ao carregar estados: " + error.message);
  }
}

async function loadCities() {
  let siglaUF = document.getElementById("siglaUf").value.toUpperCase();

  if (siglaUF !== "") {
    try {
      let resultCities = await fetch(
        `https://brasilapi.com.br/api/ibge/municipios/v1/${siglaUF}?providers=dados-abertos-br,gov,wikipedia`
      );

      if (!resultCities.ok) {
        throw new Error("Erro ao carregar cidades: " + resultCities.status);
      }

      let cities = await resultCities.json();
      let html = "";

      if (cities.type !== "not_found") {
        for (let index = 0; index < cities.length; index++) {
          const city = cities[index];

          html += `
          <option value="${city.nome}">${city.nome}</option>
          `;
        }
      }

      document.getElementById("cidade").innerHTML = html;
      return cities;
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
      alert("Erro ao carregar cidades: " + error.message);
    }
  }
}

function setSelectValue(id, inVal) {
  let dl = document.getElementById(id);
  let el = 0;

  for (let i = 0; i < dl.options.length; i++) {
    if (dl.options[i].value == inVal) {
      el = i;
      break;
    }
  }
  dl.selectedIndex = el;
}

function getParam(parametro) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(parametro);
}

async function myGet(url, method) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", authorization);

  const options = {
    method: method,
    headers: myHeaders,
    redirect: "follow",
  };

  let result = await fetch(apiUrl + url, options);
  return result;
}

async function myPost(url, method, jacson) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", authorization);

  const options = {
    method: method,
    body: JSON.stringify(jacson),
    headers: myHeaders,
    redirect: "follow",
  };

  let result = await fetch(apiUrl + url, options);
  return result;
}

function RealFormat(valor) {
  valor = valor?.replace(",", "");
  valor = valor?.replace(".", ",");
  return "<small>R$ </small>" + valor;
}

async function imprimirPedido() {
  try {
    let idPedido = getParam("id");
    let result = await myGet("/pedido/pdf/" + idPedido);

    if (!result.ok) {
      throw new Error(`Failed to fetch PDF: ${result.statusText}`);
    }

    const blob = await result.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pedido.pdf";
    document.body.appendChild(a);
    a.click();

    a.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error sending pdf:", error);
    alert("Failed to download PDF: " + error.message);
  }
}

async function enviarEmailPedido() {
  try {
    let id = getParam("id");
    let result = await myGet("/pedido/email/" + id);
    let json = await result.json();
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function exportarCsvPedido() {
  try {
    let result = await myGet("/pedido/csv");
    let dados = await result.text();

    let blob = new Blob([dados], { type: "text/csv" });
    let url = window.URL.createObjectURL(blob);

    let link = document.createElement("a");
    link.href = url;
    link.download = "pedidos.csv";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting CSV:", error);
  }
}
