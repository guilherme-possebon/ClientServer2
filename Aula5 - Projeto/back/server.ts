import { client } from "./database";
import app from "./app";

const port = 3000;
const serverInstance = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const gracefulShutdown = () => {
  serverInstance.close(() => {
    client.end();
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
