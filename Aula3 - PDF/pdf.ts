import puppeteer from "puppeteer";
import * as fs from "fs";
import { dbQuery } from "./database";

async function pdf(html: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(html);

  const pdfBuffer = await page.pdf();

  await page.close();
  await browser.close();

  return pdfBuffer;
}

async function main() {
  let sql = "select * from forma_de_pagamento order by id";

  let result = await dbQuery(sql);

  console.log(result);

  let html: string = `
        <!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pessoas</title>
  </head>
  <body>
    <table
      style="
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
        font-family: Arial, sans-serif;
      "
    >
      <thead>
        <tr style="background-color: #34495e; color: white">
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left">
            Id
          </th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left">
            Nome
          </th>
        </tr>
      </thead>
      <tbody>
        ${result
          .map(
            (item) => `
          <tr style="background-color: #f2f2f2">
            <td style="padding: 8px; border: 1px solid #ddd">${item.id}</td>
            <td style="padding: 8px; border: 1px solid #ddd">${item.name}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </body>
</html>

    `;

  let pdfBuffer = await pdf(html);
  fs.writeFileSync("pdf.pdf", pdfBuffer);
}

main();
