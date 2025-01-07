import Board from "./Board";
import { useState } from "react";
import { chess } from "../utils/constants";
import { ChessBoard, GameSocketData } from "../types/types";
import GameOver from "./GameOver";
import Loader from "./Loader";
import GameInfoPanel from "./GameInfoPanel";
import { Color } from "chess.js";

function Game() {
  const [board, setBoard] = useState<ChessBoard>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(false);
  const [turn, setTurn] = useState<Color>("w");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(true);
  const [myColor, setMyColor] = useState<Color>("w");

  const handleNewFen = (fen: string) => {
    if (fen) chess.load(fen);
    setBoard(chess.board());
    setTurn(chess.turn());
  };

  const handleMessage = (data: MessageEvent) => {
    const jsonData: GameSocketData = JSON.parse(data.data);
    switch (jsonData.event) {
      case "matched":
        setLoading(false);
        if (jsonData.message) handleNewFen(jsonData.message);
        if (jsonData.color) setMyColor(jsonData.color);
        break;
      case "update":
        if (jsonData.message) handleNewFen(jsonData.message);
        break;
      case "result":
        setGameOver(true);
        if (jsonData.message === "game-won") setWon(true);
        else setWon(false);
        ws?.close();
        break;
      case "connection":
        break;
      default:
        console.error(`Unknown Event Received From Server:- ${jsonData.event}`);
    }
  };
  const startGame = () => {
    setLoading(true);
    const socket = new WebSocket(import.meta.env.VITE_WS_URL);
    socket.onmessage = handleMessage;
    setWs(socket);
  };
  const sendMove = (move: string) => {
    ws?.send(move);
  };
  return (
    <div className="grid gap-x-12 grid-cols-2 bg-slate-800 h-screen w-screen">
      <div className="flex items-center justify-end ">
        <Board
          board={board}
          sendMove={sendMove}
          turn={turn}
          myColor={myColor}
        />
      </div>
      {!board.length && <GameInfoPanel startGame={startGame} />}
      {gameOver && <GameOver won={won} />}
      {loading && <Loader />}
    </div>
  );
}

export default Game;
