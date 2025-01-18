import { ChessPlayersInfoProps } from "../types/types";

function ChessPlayersInfo({
  playerName,
  playerTime,
  opponentName,
  opponentTime,
}: ChessPlayersInfoProps) {
  return (
    <div className="font-semibold text-white text-3xl h-16 flex justify-between items-center px-28">
      <span className="flex gap-x-2 items-center">
        {playerName}
        <div className="text-xl mt-1.5 bg-black px-2 py-0.5 rounded-md text-yellow-500">
          {playerTime}
        </div>
      </span>
      <span className="flex gap-x-2 items-center">
        <div className="text-xl mt-1.5 bg-black px-2 py-0.5 rounded-md text-yellow-500">
          {opponentTime}
        </div>
        {opponentName}
      </span>
    </div>
  );
}

export default ChessPlayersInfo;
