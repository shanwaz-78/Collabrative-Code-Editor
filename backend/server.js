import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import createSocketConnection from "./socketSetup.js";

const port = process.env.PORT || `8000`;
const app = express();

app.use(cors({ origin: "*" }));

const server = createServer(app);
const io = createSocketConnection(server);
server.listen(port);

server.on("listening", () =>
  console.log(`Server is listening at port ${port}`)
);
server.on("error", () => console.log(`Server is not listening`));
