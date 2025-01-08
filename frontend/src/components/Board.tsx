import { Color, PieceSymbol, Square } from "chess.js";
import { useCallback, useState } from "react";
import { boardProps } from "../types/types";
import { findSquareColor, getValidMoves, indexToSquare } from "../utils/utils";
import ValidMoveIndicator from "./ValidMoveIndicator";
import { chess } from "../utils/constants";

function Board({ board, sendMove, turn, myColor }: boardProps) {
  const [from, setFrom] = useState("");
  const [validMoves, setValidMoves] = useState<(string | null)[]>([]);
  const moveHandler = useCallback(
    (
      piece: Square | undefined,
      clickedSquare: Square,
      clickedColor: Color | undefined
    ) => {
      if (!from || (clickedColor && clickedColor === myColor)) {
        if (!piece) return;
        setFrom(clickedSquare);
        const newValidMoves = getValidMoves(clickedSquare);
        if (JSON.stringify(newValidMoves) !== JSON.stringify(validMoves)) {
          setValidMoves([...newValidMoves]);
        }
      } else {
        if (from === clickedSquare) {
          setFrom("");
          return;
        }
        sendMove(JSON.stringify({ from, to: clickedSquare }));
        setFrom("");
        setValidMoves([]);
      }
    },
    [from, myColor, sendMove, validMoves]
  );
  const updateCastlingMove = (type: PieceSymbol, color: Color) => {
    if (type === "k") {
      if (color === "b") {
        if (chess.getCastlingRights(color).k === true) {
          if (
            !chess.get("f8") &&
            !chess.get("g8") &&
            chess.isAttacked("g8", "w") === false
          ) {
            setValidMoves((prev) => [...prev, "g8"]);
          }
        }
        if (chess.getCastlingRights(color).q === true) {
          if (
            !chess.get("d8") &&
            !chess.get("c8") &&
            !chess.get("b8") &&
            chess.isAttacked("c8", "w") === false
          ) {
            setValidMoves((prev) => [...prev, "c8"]);
          }
        }
      }
      if (color === "w") {
        if (chess.getCastlingRights(color).k === true) {
          if (
            !chess.get("f1") &&
            !chess.get("g1") &&
            chess.isAttacked("g1", "b") === false
          ) {
            setValidMoves((prev) => [...prev, "g1"]);
          }
        }
        if (chess.getCastlingRights(color).q === true) {
          if (
            !chess.get("d1") &&
            !chess.get("c1") &&
            !chess.get("b1") &&
            chess.isAttacked("c1", "w") === false
          ) {
            setValidMoves((prev) => [...prev, "c1"]);
          }
        }
      }
    }
  };
  return (
    <div className="relative grid w-5/6 h-5/6 grid-cols-8 grid-rows-8">
      {turn !== myColor && (
        <div className="absolute inset-0 bg-gray-800 opacity-80 z-30"></div>
      )}
      {board.map((boardRow, i) => {
        return boardRow.map((boardCell, j) => {
          const index = i * 8 + j;
          const square = indexToSquare(index);
          const squareColor = findSquareColor(index);
          return (
            <span
              key={index}
              onClick={() => {
                moveHandler(boardCell?.square, square, boardCell?.color);
                if (boardCell)
                  updateCastlingMove(boardCell?.type, boardCell?.color);
              }}
              className={`w-full h-full flex justify-center items-center relative ${squareColor}`}
            >
              {validMoves.includes(square) && <ValidMoveIndicator />}
              {boardCell && (
                <img
                  src={`/pieces/${boardCell?.color + boardCell?.type}.svg`}
                  className="h-16 z-0"
                  loading="lazy"
                />
              )}
            </span>
          );
        });
      })}
    </div>
  );
}

export default Board;
