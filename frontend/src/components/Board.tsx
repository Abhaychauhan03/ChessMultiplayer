import { Color, PieceSymbol, Square } from "chess.js";
import { useCallback, useState } from "react";
import { boardProps, castlingDirections, upgradePiece } from "../types/types";
import { findSquareColor, getValidMoves, indexToSquare } from "../utils/utils";
import ValidMoveIndicator from "./ValidMoveIndicator";
import { chess } from "../utils/constants";
import PiecePromotionDialog from "./PiecePromotionDialog";

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
  const updateCastlingMove = (type: PieceSymbol, color: Color) => {
    if (type !== "k") return;
    const castlingRights = chess.getCastlingRights(color);
    const directions: castlingDirections[] = ["k", "q"];
    const opponentColor = color === "w" ? "b" : "w";
    const checkSquares = {
      b: { k: ["f8", "g8"], q: ["d8", "b8", "c8"] },
      w: { k: ["f1", "g1"], q: ["d1", "b1", "c1"] },
    };
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
          setValidMoves((prev) => [...prev, landingSquare]);
      }
    });
  };
  return (
    <div className="grid w-5/6 h-5/6 grid-cols-8 grid-rows-8">
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
