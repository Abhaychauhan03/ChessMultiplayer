import { WebSocket, WebSocketServer } from "ws";
import dotenv from "dotenv";
import { GameManager } from "./GameManager";
import { User } from "./User";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const wss = new WebSocketServer({ port });

wss.on("listening", () => {
  console.log(`WebSocket server is running`);
});

let gameManager = new GameManager();

wss.on("connection", (ws: WebSocket) => {
  const id: string = uuidv4();
  gameManager.startGame(new User(ws));
});
