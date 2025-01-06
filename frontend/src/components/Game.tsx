import Board from "./Board";
import { useEffect, useState } from "react";
import { chess } from "../utils/constants";
import { ChessBoard, GameSocketData } from "../types/types";
import GameOver from "./GameOver";
import Loader from "./Loader";
import GameInfoPanel from "./GameInfoPanel";

function Game() {
  const [board, setBoard] = useState<ChessBoard>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(true);
  const [myColor, setMyColor] = useState<string>("w");
  useEffect(() => {
    return () => {
      if (ws) ws.close();
    };
  }, [ws]);
  const handleMessage = (data: MessageEvent) => {
    const jsonData: GameSocketData = JSON.parse(data.data);
    switch (jsonData.event) {
      case "matched":
        setLoading(false);
        break;
      case "update":
        chess.load(jsonData.message);
        setBoard(chess.board());
        setDisabled(!jsonData.turn);
        if (!myColor) setMyColor(jsonData.turn ? "w" : "b");
        break;
      case "result":
        setGameOver(true);
        if (jsonData.message === "game-won") setWon(true);
        else setWon(false);
        ws?.close();
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
          disabled={disabled}
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
