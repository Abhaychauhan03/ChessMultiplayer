import { useMemo } from "react";
import { BoardCellProps } from "../types/types";
import { findSquareColor, indexToSquare } from "../utils/utils";
import ValidMoveIndicator from "./ValidMoveIndicator";

function BoardCell({
  index,
  handleClick,
  boardCell,
  validMoves,
}: BoardCellProps) {
  const square = useMemo(() => indexToSquare(index), [index]);
  const squareColor = useMemo(() => findSquareColor(index), [index]);
  return (
    <span
      key={index}
      onClick={() => handleClick(boardCell, square)}
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
}

export default BoardCell;
