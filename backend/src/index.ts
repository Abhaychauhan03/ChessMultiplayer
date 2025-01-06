import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { User } from "./User";
import { v4 as uuidv4 } from "uuid";

const app = express();
const wss = new WebSocketServer({ port: 8081 });

app.get("/game", (req, res) => {});

let gameManager = new GameManager();

wss.on("connection", (ws: WebSocket) => {
  const id: string = uuidv4();
  gameManager.startGame(new User(ws));
});

app.listen(8080, () => {
  console.log("Server is Running");
});
