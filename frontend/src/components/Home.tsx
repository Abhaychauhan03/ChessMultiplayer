import { useNavigate } from "react-router-dom";
import chessBoard from "../assets/chessBoard.png";
function Home() {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 bg-slate-800 h-screen w-screen">
      <div className="flex items-center justify-end mr-16">
        <img
          className="w-7/12"
          src={chessBoard}
          alt="Chessboard"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-y-10 max-w-96 justify-center ml-16">
        <h3 className="font-bold text-white text-6xl text-center">
          Want To Play Chess Online!
        </h3>
        <button
          onClick={() => navigate("/game")}
          className="font-semibold text-white text-3xl bg-lime-500 hover:bg-lime-700 px-10 py-4 rounded-lg"
        >
          Play Game
        </button>
      </div>
    </div>
  );
}

export default Home;
