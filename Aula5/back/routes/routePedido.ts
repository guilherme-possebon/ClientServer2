import { Router } from "express";
import {
  deleteProduct,
  getAllProduct,
  getOneByIdProduct,
  insertProduct,
  updateProduct,
} from "../controller/pedidoController";

export const routePedido = Router();

routePedido.get("/", getAllProduct);
routePedido.get("/:id", getOneByIdProduct);
routePedido.post("/", insertProduct);
routePedido.put("/:id", updateProduct);
routePedido.delete("/:id", deleteProduct);
