import * as fs from "fs";
import { dbQuery } from "./database";

let sql = "select * from livros order by id";

interface unidadeInterface {
  id: number;
  titulo: string;
  autor: string;
  qtpaginas: number;
  emprestado: boolean;
}

async function generateCsv() {
  let result: unidadeInterface[] = await dbQuery(sql);
  let dados = result;

  let header = '"Id";"Titulo";"Autor";"qtPaginas";"Emprestado"\r\n';
  let csv = header;

  for (let idx in dados) {
    let unidade = dados[idx];
    csv +=
      '"' +
      unidade.id +
      '";"' +
      unidade.titulo +
      '";"' +
      unidade.autor +
      '";"' +
      unidade.qtpaginas +
      '";"' +
      unidade.emprestado +
      '"\r\n';
  }

  console.log(csv);

  fs.writeFileSync("outputBD.csv", csv);
}
generateCsv();
