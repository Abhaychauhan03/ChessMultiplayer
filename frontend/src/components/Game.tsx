import Board from "./Board";
import { useState } from "react";
import { chess } from "../utils/constants";
import {
  ChessBoard,
  gameEvents,
  GameSocketData,
  gameTimers,
} from "../types/types";
import GameOver from "./GameOver";
import Loader from "./Loader";
import GameInfoPanel from "./GameInfoPanel";
import { Color } from "chess.js";
import { formatName, NumberToTime, reverseBoard } from "../utils/utils";
import ChessPlayersInfo from "./ChessPlayersInfo";

let myColor: Color = "w";

function Game() {
  const [board, setBoard] = useState<ChessBoard>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(false);
  const [turn, setTurn] = useState<Color>("w");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(true);
  const [playerName, setPlayerName] = useState("p1");
  const [opponentName, setOpponentName] = useState("p2");
  const [playerTime, setPlayerTime] = useState("00:00");
  const [opponentTime, setOpponentTime] = useState("00:00");

  const handleNewFen = (fen: string) => {
    chess.load(fen);
    setBoard(myColor === "w" ? chess.board() : reverseBoard(chess.board()));
    setTurn(chess.turn());
  };

  const handleMessage = (data: MessageEvent) => {
    const { event, message, color, opponentName, playerName }: GameSocketData =
      JSON.parse(data.data);
    switch (event) {
      case gameEvents.Matched:
        setLoading(false);
        if (color) myColor = color;
        if (message) handleNewFen(message as string);
        if (playerName) setPlayerName(formatName(playerName));
        if (opponentName) setOpponentName(formatName(opponentName));
        break;
      case gameEvents.Update:
        if (message) handleNewFen(message as string);
        break;
      case gameEvents.Result:
        setGameOver(true);
        if (message === "game-won") setWon(true);
        else setWon(false);
        ws?.close();
        break;
      case gameEvents.Connection:
        break;
      case gameEvents.TimerUpdate: {
        const { whiteTime, blackTime }: gameTimers = message as gameTimers;
        setPlayerTime(NumberToTime(myColor === "w" ? whiteTime : blackTime));
        setOpponentTime(NumberToTime(myColor === "w" ? blackTime : whiteTime));
        break;
      }
      default:
        console.error(`Unknown Event Received From Server:- ${event}`);
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
    <div className="bg-slate-800 h-screen w-screen flex flex-col">
      {board.length !== 0 && (
        <ChessPlayersInfo
          playerName={playerName}
          playerTime={playerTime}
          opponentName={opponentName}
          opponentTime={opponentTime}
        />
      )}
      <div className="grid gap-x-12 grid-cols-2 flex-grow">
        <div className="flex items-center justify-end">
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
    </div>
  );
}

export default Game;
