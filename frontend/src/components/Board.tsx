import { Color, Square } from "chess.js";
import { useCallback, useState } from "react";
import { boardCell, boardProps, upgradePiece } from "../types/types";
import { getValidMoves, updateCastlingMove } from "../utils/utils";
import { chess } from "../utils/constants";
import PiecePromotionDialog from "./PiecePromotionDialog";
import BoardCell from "./BoardCell";

function Board({ board, sendMove, turn, myColor }: boardProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isPromotion, setIsPromotion] = useState(false);
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
          setValidMoves([]);
          return;
        }
        const { color, type } = chess.get(from as Square);
        const promotionRow = color === "w" ? "8" : "1";
        const isPromotion =
          type === "p" && clickedSquare.endsWith(promotionRow);
        if (isPromotion) {
          setTo(clickedSquare);
          setIsPromotion(true);
        } else {
          sendMove(
            JSON.stringify({
              from,
              to: clickedSquare,
            })
          );
          setFrom("");
          setValidMoves([]);
        }
      }
    },
    [from, myColor, sendMove, validMoves]
  );
  const handlePromotionMove = (piece: upgradePiece) => {
    sendMove(
      JSON.stringify({
        from,
        to,
        promotion: piece,
      })
    );
    setFrom("");
    setValidMoves([]);
    setIsPromotion(false);
  };

  const handleClick = (boardCell: boardCell, square: Square) => {
    moveHandler(boardCell?.square, square, boardCell?.color);
    if (boardCell?.type === "k")
      setValidMoves((prev) => [
        ...prev,
        ...updateCastlingMove(boardCell.type, boardCell.color),
      ]);
  };
  return (
    <div className="grid w-full h-full max-w-screen-md py-8 px-16 grid-cols-8 grid-rows-8">
      {turn !== myColor && (
        <div className="absolute inset-0 bg-gray-800 opacity-80 z-30"></div>
      )}
      {isPromotion && (
        <PiecePromotionDialog
          color={myColor}
          handlePromotionMove={handlePromotionMove}
        />
      )}
      {board.map((boardRow, i) => {
        return boardRow.map((boardCell, j) => {
          const index = myColor === "w" ? i * 8 + j : 63 - (i * 8 + j);
          return (
            <BoardCell
              key={index}
              index={index}
              boardCell={boardCell}
              handleClick={handleClick}
              validMoves={validMoves}
            />
          );
        });
      })}
    </div>
  );
}

export default Board;
