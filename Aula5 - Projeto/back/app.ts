import express, { NextFunction } from "express";
import { Express, Request, Response } from "express";
import cors from "cors";
import { routePedido } from "./routes/routePedido";
import routePedidoItem from "./routes/routePedidoItem";
import { routeUsuario } from "./routes/routeUsuario";
import session from "express-session";

let app: Express = express();

app.use(
  session({
    secret: "session secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, //só para https
  })
);
app.use(express.json());

let options: cors.CorsOptions = {
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  credentials: true,
};

app.use(cors(options));

declare module "express-session" {
  interface SessionData {
    views: number;
  }
}

app.get("/", (req: Request, res: Response) => {
  if (req.session.views) {
    req.session.views++;

    res.json({
      message: "Obrigado pelo retorno",
      views: req.session.views,
      expires: req.session.cookie.maxAge,
    });
  } else {
    req.session.views = 1;
    res.json({
      message: "Bem vindo filhotao",
      views: req.session.views,
      expires: req.session.cookie.maxAge,
    });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "okay" });
});
app.use(routeUsuario);
app.use("/login", routeUsuario);
app.use("/pedido", routePedido);
app.use("/pedidoitem", routePedidoItem);

export default app;
