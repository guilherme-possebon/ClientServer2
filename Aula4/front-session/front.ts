import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3001, () => console.log("front running on port 3001"));
