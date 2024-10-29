import express, { NextFunction } from "express";
import { Express, Request, Response } from "express";
import cors from "cors";
import { routePedido } from "./routes/routepedido";
import routePedidoItem from "./routes/routePedidoItem";
import { routeUsuario } from "./routes/routeUsuario";

let app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "okay" });
});
app.use(routeUsuario);
app.use("/login", routeUsuario);
app.use("/pedido", routePedido);
app.use("/pedidoitem", routePedidoItem);

export default app;
