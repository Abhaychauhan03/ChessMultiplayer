import { GameInfoPanelProps } from "../types/types";

function GameInfoPanel({ startGame }: GameInfoPanelProps) {
  return (
    <div className="flex ml-32 items-center">
      <button
        onClick={startGame}
        className="font-semibold text-white text-3xl bg-lime-500 hover:bg-lime-700 h-20 w-60 rounded-lg"
      >
        Start Game
      </button>
    </div>
  );
}

export default GameInfoPanel;
