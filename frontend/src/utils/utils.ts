import { Color, PieceSymbol, Square } from "chess.js";
import { chess } from "./constants";
import { castlingDirections, ChessBoard } from "../types/types";

export const convertToSquare = (move: string) =>
  move.match(/[a-h][1-8]/)?.[0] || null;

export const getValidMoves = (from: Square) => {
  return chess.moves({ square: from }).map((move) => convertToSquare(move));
};

export const indexToSquare = (num: number) => {
  return (String.fromCharCode((num % 8) + 97) +
    (8 - Math.floor(num / 8))) as Square;
};

export const findSquareColor = (index: number) => {
  const isEvenRow = Math.floor(index / 8) % 2 !== 0;
  const isEvenColumn = index % 2 == 0;
  return isEvenRow
    ? isEvenColumn
      ? "bg-lime-700"
      : "bg-amber-100"
    : isEvenColumn
    ? "bg-amber-100"
    : "bg-lime-700";
};

export const NumberToTime = (num: number) => {
  return (
    "" +
    Math.floor(num / 60) +
    ":" +
    String(Math.floor(num % 60)).padStart(2, "0")
  );
};

export const updateCastlingMove = (type: PieceSymbol, color: Color) => {
  if (type !== "k") return [];
  const castlingRights = chess.getCastlingRights(color);
  const directions: castlingDirections[] = ["k", "q"];
  const opponentColor = color === "w" ? "b" : "w";
  const checkSquares = {
    b: { k: ["f8", "g8"], q: ["d8", "b8", "c8"] },
    w: { k: ["f1", "g1"], q: ["d1", "b1", "c1"] },
  };
  const landingSquares: Square[] = [];
  directions.forEach((dir: castlingDirections) => {
    if (castlingRights[dir]) {
      const toCheckArray = checkSquares[color][dir];
      const landingSquare = toCheckArray[toCheckArray.length - 1];
      const squaresCheck = toCheckArray.every(
        (square) => !chess.get(square as Square)
      );

      const notAttacked = !chess.isAttacked(
        landingSquare as Square,
        opponentColor
      );
      if (squaresCheck && notAttacked)
        landingSquares.push(landingSquare as Square);
    }
  });
  return landingSquares;
};

export const formatName = (playerName: string) => {
  const playerArray = playerName.split("-");
  return playerArray[0].slice(0, 5) + "-" + playerArray.pop();
};

export const reverseBoard = (board: ChessBoard) =>
  board.map((row) => row.reverse()).reverse();
