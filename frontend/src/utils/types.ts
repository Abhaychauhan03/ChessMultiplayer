import { Color, PieceSymbol, Square } from "chess.js";

export type ChessBoard = ({
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null)[][];

export type GameSocketData = { event: string; message: string; turn: boolean };

export type boardProps = {
  board: ChessBoard;
  sendMove: (move: string) => void;
  disabled: boolean;
  myColor: string;
};
