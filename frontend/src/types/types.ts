import { Color, PieceSymbol, Square } from "chess.js";

export type ChessBoard = ({
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null)[][];

export type GameSocketData = {
  event: string;
  message?: string | gameTimers;
  color?: Color;
  playerName?: string;
  opponentName?: string;
};

export type boardProps = {
  board: ChessBoard;
  sendMove: (move: string) => void;
  turn: Color;
  myColor: Color;
};

export type castlingDirections = "k" | "q";

export type upgradePiece = "q" | "r" | "n" | "b";

export type boardCell = {
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null;

export type gameTimers = { whiteTime: number; blackTime: number };

export type GameInfoPanelProps = {
  startGame: () => void;
};

export type GameOverProps = { won: boolean };

export type BoardCellProps = {
  index: number;
  handleClick: (boardCell: boardCell, square: Square) => void;
  boardCell: boardCell;
  validMoves: (string | null)[];
};

export type ChessPlayersInfoProps = {
  playerName: string;
  playerTime: string;
  opponentName: string;
  opponentTime: string;
};

export enum gameEvents {
  Matched = "matched",
  TimerUpdate = "timer-update",
  Update = "update",
  Error = "error",
  Result = "result",
  Connection = "connection",
}

export enum gameResult {
  GameWon = "game-won",
  GameLost = "game-lost",
}
