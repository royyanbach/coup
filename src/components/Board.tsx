import { PLAYER_ICONS, PlayerIcon } from "../constants";
import PlayerOverview from "./PlayerOverview";
import ActivitiesOverview from "./ActivitiesOverview";
import useGameStore from "../stores/game";

type BoardProps = {
  onGameStart?: () => void;
  onChangePlayerIcon?: (icon: PlayerIcon) => void;
};

const Board = ({
  onGameStart = () => {},
  onChangePlayerIcon = () => {},
}: BoardProps) => {
  const { isStarted } = useGameStore();

  return (
    <div className="w-full h-full px-6 pt-14 md:pt-[88px] pb-24 md:pb-[128px] flex flex-col gap-4 md:gap-8">
      <PlayerOverview />

      <ActivitiesOverview />

      {!isStarted && (
        <div className="fixed bottom-3 md:bottom-6 left-0 w-full flex gap-2 md:gap-4 px-4 justify-center items-center">
          <div className="flex gap-2 md:gap-4 items-center">
            <button
              className="bg-white rounded-full flex justify-center items-center size-16 md:size-24"
              onClick={onGameStart}
            >
              <img src="icons/start.png" className="size-10 md:size-16" />
            </button>
            <hr className="h-9 md:h-16 w-px bg-white mx-2 md:mx-4" />
          </div>
          <div className="flex gap-2 md:gap-4 items-center overflow-x-scroll">
            {Object.entries(PLAYER_ICONS).map(([key, value]) => (
              <button
                className="bg-white rounded-full text-center bg-[#b9b9b9] text-4xl md:text-5xl size-16 md:size-24 flex-none"
                key={key}
                onClick={() => onChangePlayerIcon(key as PlayerIcon)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* <div className="fixed bottom-3 md:bottom-6 left-0 w-full flex gap-2 md:gap-4 px-4 justify-center items-center">
        <div className="flex gap-2 md:gap-4 items-center">
          <button className="bg-white rounded-full shrink-0 flex justify-center items-center size-16 md:size-24">
            <img src="icons/sword.png" className="size-8 md:size-16" />
          </button>
          <hr className="h-9 md:h-16 w-px bg-white mx-2 md:mx-4" />
        </div>
        <div className="flex gap-2 md:gap-4 items-center overflow-x-scroll">
          <button className="rounded-full shrink-0 flex justify-center items-center size-16 md:size-24 bg-white">
            <img src="icons/coin-1.png" className="size-10 md:size-16" />
          </button>
          <button className="rounded-full shrink-0 flex justify-center items-center size-16 md:size-24 bg-white">
            <img src="icons/coin-2.png" className="size-10 md:size-16" />
          </button>
          <button className="rounded-full shrink-0 flex justify-center items-center size-16 md:size-24 bg-[#ffa6e2]">
            <img src="icons/coin-3.png" className="size-10 md:size-16" />
          </button>
          <button className="rounded-full shrink-0 flex justify-center items-center size-16 md:size-24 bg-[#85c8ff]">
            <img src="icons/steal.png" className="size-10 md:size-16" />
          </button>
          <button className="rounded-full shrink-0 flex justify-center items-center size-16 md:size-24 bg-[#9398db]">
            <img src="icons/kill.png" className="size-10 md:size-16" />
          </button>
          <button className="rounded-full shrink-0 flex justify-center items-center size-16 md:size-24 bg-[#b9e78c]">
            <img src="icons/exchange.png" className="size-10 md:size-16" />
          </button>
        </div>
      </div> */}

      {/* <div className="fixed bottom-3 md:bottom-6 left-0 w-full flex gap-2 md:gap-4 justify-center items-center">
        <button className='bg-white text-2xl py-4 px-8 rounded font-bold w-[400px]'>START GAME</button>
      </div> */}

      {/* <div className="fixed bottom-3 md:bottom-6 left-0 w-full flex gap-4 justify-center items-center">
        <button className="bg-white rounded-full shrink-0 flex justify-center items-center size-16 md:size-24 bg-[#efd897]">
          <img src="icons/challenge.png" className="size-10 md:size-16" />
        </button>
        <button className="bg-white rounded-full shrink-0 flex justify-center items-center size-16 md:size-24 bg-[#f5a9a9]">
          <img src="icons/reject.png" className="size-10 md:size-16" />
        </button>
        <button className="bg-white rounded-full shrink-0 flex justify-center items-center size-16 md:size-24 bg-[#b9b9b9]">
          <img src="icons/pass.png" className="size-10 md:size-16" />
        </button>
      </div> */}

      {/* <div className="fixed bottom-3 md:bottom-6 left-0 w-full flex gap-2 md:gap-4 justify-center items-center">
        <button className="bg-white rounded-full">
          <img src="icons/ambassador-60.png" className="size-16 md:size-24" />
        </button>
        <button className="bg-white rounded-full">
          <img src="icons/assasin-60.png" className="size-16 md:size-24" />
        </button>
        <button className="bg-white rounded-full">
          <img src="icons/captain-60.png" className="size-16 md:size-24" />
        </button>
        <button className="bg-white rounded-full">
          <img src="icons/contessa-60.png" className="size-16 md:size-24" />
        </button>
        <button className="bg-white rounded-full">
          <img src="icons/duke-60.png" className="size-16 md:size-24" />
        </button>
      </div> */}
    </div>
  );
};

export default Board;