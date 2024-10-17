import { Router } from "express";
import {
  deleteProductItem,
  getAllProductItem,
  getOneByIdProductItem,
  insertProductItem,
  updateProductItem,
} from "../controller/pedidoItemController";

const routePedidoItem = Router();

routePedidoItem.get("/", getAllProductItem);
routePedidoItem.get("/:id", getOneByIdProductItem);
routePedidoItem.post("/", insertProductItem);
routePedidoItem.put("/:id", updateProductItem);
routePedidoItem.delete("/:id", deleteProductItem);

export default routePedidoItem;
