import { Color, Square } from "chess.js";
import { useCallback, useState } from "react";
import { boardProps } from "../types/types";
import { findSquareColor, getValidMoves, indexToSquare } from "../utils/utils";
import ValidMoveIndicator from "./validMoveIndicator";

function Board({ board, sendMove, disabled, myColor }: boardProps) {
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
          setValidMoves([...getValidMoves(clickedSquare)]);
        }
      } else {
        if (from === clickedSquare) setFrom("");
        sendMove(JSON.stringify({ from, to: clickedSquare }));
        setFrom("");
        setValidMoves([]);
      }
    },
    [from, myColor, sendMove, validMoves]
  );
  return (
    <div className="relative grid w-5/6 h-5/6 grid-cols-8 grid-rows-8">
      {disabled && (
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
              onClick={() =>
                moveHandler(boardCell?.square, square, boardCell?.color)
              }
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
