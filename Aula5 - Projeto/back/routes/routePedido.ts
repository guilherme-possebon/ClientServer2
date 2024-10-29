import { Router } from "express";
import {
  deleteProduct,
  getAllProduct,
  getOneByIdProduct,
  getProductCsv,
  getProductEmail,
  getProductPdf,
  insertProduct,
  updateProduct,
} from "../controller/pedidoController";

export const routePedido = Router();

routePedido.get("/", getAllProduct);
routePedido.get("/csv", getProductCsv);
routePedido.get("/email/:id", getProductEmail);
routePedido.get("/pdf/:id", getProductPdf);
routePedido.get("/:id", getOneByIdProduct);
routePedido.post("/", insertProduct);
routePedido.put("/:id", updateProduct);
routePedido.delete("/:id", deleteProduct);
