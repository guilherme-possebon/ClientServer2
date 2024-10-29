import express from "express";
import { Router, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
let options: cors.CorsOptions = {
  origin: ["http://localhost:3001"],
  credentials: true,
};

app.use(cors(options));

app.get("/", (req: Request, res: Response) => {
  console.log("Recebido nome: " + req.cookies["nome"]);

  res.status(200).json({ message: "OK" });
});

app.listen(3000, () => console.log("back running on port 3000"));
