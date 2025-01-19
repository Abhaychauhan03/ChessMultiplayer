import { ChessPlayersInfoProps } from "../types/types";

function ChessPlayersInfo({
  playerName,
  playerTime,
  opponentName,
  opponentTime,
}: ChessPlayersInfoProps) {
  return (
    <div className="relative flex justify-center h-16">
      <div className="absolute h-full w-5/12 blur-sm bg-white"></div>
      <div className="absolute h-full font-semibold text-2xl flex justify-center items-center gap-x-44 bg-transparent text-slate-800 w-1/2 rounded-b-lg px-4">
        <span className="flex gap-x-2 items-center">
          {playerName}
          <div className="text-lg mt-1 bg-black px-2 py-0.5 rounded-md text-yellow-500">
            {playerTime}
          </div>
        </span>
        <span className="flex gap-x-2 items-center">
          <div className="text-lg mt-1 bg-black px-2 py-0.5 rounded-md text-yellow-500">
            {opponentTime}
          </div>
          {opponentName}
        </span>
      </div>
    </div>
  );
}

export default ChessPlayersInfo;
