import * as fs from "fs";

let dados = [
  {
    nome: "Guilherme possebon",
    fone: "51 99761 8801",
    cidade: "Muçum - RS",
  },
  {
    nome: "Mollie Higgins",
    fone: "54 5021 7839",
    cidade: "Northern Mariana Islands",
  },
  {
    nome: "Ella Schultz",
    fone: "58 5675 8571",
    cidade: "Liberia",
  },
  {
    nome: "Minnie Black",
    fone: "20 9630 7878",
    cidade: "Greenland",
  },
];

let header = '"Nome";"Fone";"Cidade"\r\n';
let csv = header;

for (let idx in dados) {
  let pessoa = dados[idx];
  csv +=
    '"' + pessoa.nome + '";"' + pessoa.fone + '";"' + pessoa.cidade + '"\r\n';
}

console.log(csv);

fs.writeFileSync("output.csv", csv);
