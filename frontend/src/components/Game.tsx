import Board from "./Board";
import { useState } from "react";
import { chess } from "../utils/constants";
import { ChessBoard, GameSocketData } from "../utils/types";
import GameOver from "./GameOver";
import Loader from "./Loader";
import GameInfoPanel from "./GameInfoPanel";

let ws: WebSocket;
let myColor: string;

function Game() {
  const [board, setBoard] = useState<ChessBoard>([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(true);

  const handleMessage = (data: MessageEvent) => {
    const jsonData: GameSocketData = JSON.parse(data.data);
    if (jsonData.event === "matched") setLoading(false);
    else if (jsonData.event === "update") {
      chess.load(jsonData.message);
      setBoard(chess.board());
      setDisabled(!jsonData.turn);
      if (!myColor) myColor = jsonData.turn ? "w" : "b";
    } else if (jsonData.event === "result") {
      setGameOver(true);
      if (jsonData.message === "game-won") setWon(true);
      else setWon(false);
      ws.close();
    }
  };
  const startGame = () => {
    setLoading(true);
    ws = new WebSocket(import.meta.env.VITE_WS_URL);
    ws.onmessage = handleMessage;
  };
  const sendMove = (move: string) => {
    ws.send(move);
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
