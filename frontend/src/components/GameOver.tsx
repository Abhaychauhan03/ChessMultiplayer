import { useNavigate } from "react-router-dom";

type GameOverProps = { won: boolean };

function GameOver({ won }: GameOverProps) {
  const navigate = useNavigate();
  return (
    <div className="absolute z-40 bg-gray-800 bg-opacity-50 inset-0 flex items-center justify-center">
      <div className="w-96 h-72 bg-white rounded-lg flex flex-col justify-around items-center">
        <span className="font-bold text-3xl">Game Over!</span>
        <span className="font-bold text-5xl pl-8 flex items-center justify-center">
          You {won ? "Won" : "Lost"}
          <span className="text-5xl pl-2 pb-1">{won ? "🎉" : "😔"}</span>
        </span>
        <button
          onClick={() => navigate(0)}
          className=" bg-green-600 text-white font-bold text-3xl px-8 py-3 rounded-md bg-opacity-100"
        >
          Start New Game
        </button>
      </div>
    </div>
  );
}

export default GameOver;
