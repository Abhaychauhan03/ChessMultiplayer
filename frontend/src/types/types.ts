import { Color, PieceSymbol, Square } from "chess.js";

export type ChessBoard = ({
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null)[][];

export type GameSocketData = {
  event: string;
  message?: string;
  color?: Color;
};

export type boardProps = {
  board: ChessBoard;
  sendMove: (move: string) => void;
  turn: Color;
  myColor: Color;
};
