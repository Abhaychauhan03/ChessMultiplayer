import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { User } from "./User";
import { v4 as uuidv4 } from "uuid";

const wss = new WebSocketServer({ port: 8080 });

wss.on("listening", () => {
  console.log(`WebSocket server is running`);
});

let gameManager = new GameManager();

wss.on("connection", (ws: WebSocket) => {
  const id: string = uuidv4();
  gameManager.startGame(new User(ws));
});
