import express from "express";
import { Router, Request, Response } from "express";
import cors from "cors";
import session from "express-session";

//https://expressjs.com/en/resources/middleware/session.html
//npm install express-session
//npm install @types/express-session
//npm install cors
//npm install @types/cors

const app = express();

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
  origin: ["http://localhost:3001"],
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
    //aumenta a views em 1
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

app.listen(3000, () => console.log("server running on port 3000"));
