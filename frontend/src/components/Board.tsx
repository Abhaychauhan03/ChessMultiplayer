import { Color, Square } from "chess.js";
import { useState } from "react";
import { boardProps } from "../utils/types";
import { getValidMoves } from "../utils/utils";

function Board({ board, sendMove, disabled, myColor }: boardProps) {
  console.log(myColor, disabled);
  const [from, setFrom] = useState("");
  const [validMoves, setValidMoves] = useState<(string | null)[]>([]);
  const indexToSquare = (num: number) => {
    return (String.fromCharCode((num % 8) + 97) +
      (8 - Math.floor(num / 8))) as Square;
  };
  const moveHandler = (
    piece: Square | undefined,
    clickedSquare: Square,
    clickedColor: Color | undefined
  ) => {
    if (!from || (clickedColor && clickedColor === myColor)) {
      if (!piece) return;
      setFrom(clickedSquare);
      console.log(getValidMoves(clickedSquare));
      setValidMoves([...getValidMoves(clickedSquare)]);
    } else {
      if (from === clickedSquare) setFrom("");
      sendMove(JSON.stringify({ from, to: clickedSquare }));
      setFrom("");
      setValidMoves([]);
    }
  };
  return (
    <div className="relative grid w-5/6 h-5/6 grid-cols-8 grid-rows-8">
      {disabled && (
        <div className="absolute inset-0 bg-gray-800 opacity-80 z-30"></div>
      )}
      {board.map((boardRow, i) => {
        return boardRow.map((boardCell, j) => {
          const index = i * 8 + j;
          const square = indexToSquare(index);
          if (Math.floor(index / 8) % 2 !== 0)
            return (
              <span
                key={index}
                onClick={() =>
                  moveHandler(boardCell?.square, square, boardCell?.color)
                }
                className={`w-full h-full flex justify-center items-center relative ${
                  index % 2 == 0 ? "bg-lime-700" : "bg-amber-100"
                }`}
              >
                {validMoves.includes(square) && (
                  <svg
                    className="w-5 h-5 fill-yellow-500 opacity-70 absolute z-40"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                  >
                    <circle cx="50" cy="50" r="50" />
                  </svg>
                )}
                {boardCell && (
                  <img
                    src={`/pieces/${boardCell?.color + boardCell?.type}.svg`}
                    className="h-16 z-0"
                  />
                )}
              </span>
            );
          else
            return (
              <span
                key={index}
                onClick={() =>
                  moveHandler(boardCell?.square, square, boardCell?.color)
                }
                className={`w-full h-full flex justify-center items-center relative ${
                  index % 2 == 0 ? "bg-amber-100" : "bg-lime-700"
                }`}
              >
                {validMoves.includes(square) && (
                  <svg
                    className="w-5 h-5 fill-yellow-500 opacity-70 absolute z-40"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                  >
                    <circle cx="50" cy="50" r="50" />
                  </svg>
                )}
                {boardCell && (
                  <img
                    src={`/pieces/${boardCell?.color + boardCell?.type}.svg`}
                    className="h-16 z-0"
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
