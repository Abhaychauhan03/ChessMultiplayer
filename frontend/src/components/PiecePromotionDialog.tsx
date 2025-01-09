import { Color } from "chess.js";
import { upgradePiece } from "../types/types";
import { upgrade } from "../utils/constants";

function PiecePromotionDialog({
  color,
  handlePromotionMove,
}: {
  color: Color;
  handlePromotionMove: (piece: upgradePiece) => void;
}) {
  return (
    <div className="absolute z-40 bg-gray-800 bg-opacity-50 inset-0 flex items-center justify-center">
      <div className="w-1/2 max-w-lg h-80 p-4 bg-white rounded-lg flex flex-col items-center">
        <span className="font-bold text-4xl">Which piece do you want?</span>
        <div className="grid grid-cols-2 w-full h-full">
          {upgrade.map((piece) => (
            <img
              key={piece}
              className="w-20 self-center justify-self-center cursor-pointer hover:bg-slate-500 rounded-md"
              onClick={() => handlePromotionMove(piece)}
              src={`/pieces/${color}${piece}.svg`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PiecePromotionDialog;
