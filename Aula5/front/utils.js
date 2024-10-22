const apiUrl = "http://localhost:3000";

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
  const options = {
    method: method,
    redirect: "follow",
  };

  let result = await fetch(apiUrl + url, options);
  return result;
}

async function myPost(url, method, jacson) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

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
