import { useMemo, useState } from "react";
import classnames from "classnames";
import { ROOM_EVENTS, PLAYER_ICONS, PlayerIcon, RoomEvent } from "../constants";
import { User } from "src/stores/users";

type BoardProps = {
  activities: RoomEvent[];
  users: User[];
  onGameStart?: () => void;
  onChangePlayerIcon?: (icon: PlayerIcon) => void;
  mySocketId?: string;
};

const Board = ({
  activities = [],
  users = [],
  onGameStart = () => {},
  onChangePlayerIcon = () => {},
  mySocketId = '',
}: BoardProps) => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isCharacterHidden, setIsCharacterHidden] = useState(true);
  const myProfile = useMemo(() => users.find(u => u.id === mySocketId), [users, mySocketId]);
  const otherPlayers = useMemo(() => users.filter(u => u.id !== mySocketId), [users, mySocketId]);

  const getUserProfileIcon = (userId?: string) => {
    const iconKey = users.find(u => u.id === userId)?.profileIcon;
    if (iconKey) {
      return PLAYER_ICONS[iconKey];
    }
  }

  const formatActivity = (activity: RoomEvent) => {
    let profileIcon;
    switch (activity.eventType) {
      case ROOM_EVENTS.ROOM_CREATED:
        profileIcon = getUserProfileIcon(activity.users[0].id);
        return profileIcon ? `${profileIcon} created a new game` : null;
      case ROOM_EVENTS.ROOM_JOINED:
        profileIcon = getUserProfileIcon(myProfile?.id);
        return profileIcon ? `${profileIcon} joined the game` : null;
      case ROOM_EVENTS.PLAYER_JOINED:
        profileIcon = getUserProfileIcon(activity.user.id);
        return profileIcon ? `${profileIcon} joined the game` : null;
      // case ROOM_EVENTS.JOIN_ROOM:
      // case ROOM_EVENTS.PLAYER_JOINED:
      //   return `${getUserProfileIcon(activity.actor)} joined the game`;
      default:
        return 'Unknown activity';
    };
  }

  return (
    <div className="w-full h-full px-6 pt-14 md:pt-[88px] pb-24 md:pb-[128px] flex flex-col gap-4 md:gap-8">
      <ul className="flex gap-4 overflow-x-auto">
        <li className="bg-slate-800 px-4 py-2 md:py-4 rounded-lg text-white flex flex-col gap-2 flex-none">
          <p className="text-center text-2xl font-bold">{myProfile?.profileIcon ? PLAYER_ICONS[myProfile.profileIcon] : ''}</p>
          <div className={
            classnames(
              "flex gap-2 relative before:content-['Tap_and_hold_to_view'] before:text-center before:text-xs before:size-full before:bg-gray-600/90 before:rounded before:flex before:items-center before:justify-center before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2",
            )
          }>
            <img src="icons/duke-60.png" className="size-12" />
            <img src="icons/coup-square-60.png" className="size-12" />
          </div>
          <p className="text-center text-xs">3 COINS</p>
        </li>
        {otherPlayers.map(user => (
          <li key={user.id} className="bg-slate-800 px-4 py-2 md:py-4 rounded-lg text-white flex flex-col gap-2 flex-none">
            <p className="text-center text-2xl font-bold">{PLAYER_ICONS[user.profileIcon]}</p>
            <div className="flex gap-2 relative">
              <img src="icons/coup-square-60.png" className="size-12" />
              <img src="icons/coup-square-60.png" className="size-12" />
            </div>
            <p className="text-center text-xs">3 COINS</p>
          </li>
        ))}
        {/* <li className="bg-slate-800 p-4 rounded-lg text-white w-[180px] flex flex-col gap-2 flex-none border-l-8 border-slate-400">
          <span className="font-bold">💩 (3 COINS)</span>
          <div className="flex gap-2">
            <img src="icons/coup-square-60.png" className="size-12" />
            <img src="icons/coup-square-60.png" className="size-12" />
          </div>
        </li> */}
      </ul>

      <section className="flex gap-4 w-full grow main text-white w-full overflow-y-auto p-4 rounded-lg">
        <ul>
          {activities.filter(Boolean).map((activity, index) => (
            <li key={index} className="font-light">{formatActivity(activity)}</li>
          ))}
          {/* <li className="font-light">Game started</li>
          <li className="font-light">❤️ perform <strong className="font-bold text-[#464867]">assasin</strong> to 💩</li>
          <li className="font-light">💩 perform <strong className="font-bold text-[#bd8fae]">tax</strong></li>
          <li className="font-light">😒 perform <strong className="font-bold ">challenge</strong> to 💩</li> */}
        </ul>
      </section>

      {!isGameStarted && (
        <div className="fixed bottom-3 md:bottom-6 left-0 w-full flex gap-2 md:gap-4 px-4 justify-center items-center">
          <div className="flex gap-2 md:gap-4 items-center">
            <button
              className="bg-white rounded-full flex justify-center items-center size-16 md:size-24"
              onClick={onGameStart}
            >
              <img src="icons/start.png" className="size-10 md:size-16" />
            </button>
            <hr width="1" className="h-9 md:h-16 w-px bg-white mx-2 md:mx-4" />
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

      {/* <div className="fixed bottom-6 left-0 w-full flex gap-4 justify-center items-center">
        <button className="bg-white rounded-full p-6">
          <img src="icons/sword.png" className="size-12" />
        </button>
        <hr width="1" size="500" className="h-[45px] w-px bg-white mx-4" />
        <button className="bg-white rounded-full p-6 bg-[#b9b9b9]">
          <img src="icons/coin-1.png" className="size-12" />
        </button>
        <button className="bg-white rounded-full p-6 bg-[#b9b9b9]">
          <img src="icons/coin-2.png" className="size-12" />
        </button>
        <button className="bg-white rounded-full p-6 bg-[#bd8fae]">
          <img src="icons/coin-3.png" className="size-12" />
        </button>
        <button className="bg-white rounded-full p-6 bg-[#93b7d7]">
          <img src="icons/steal.png" className="size-12" />
        </button>
        <button className="bg-white rounded-full p-6 bg-[#464867]">
          <img src="icons/kill.png" className="size-12" />
        </button>
        <button className="bg-white rounded-full p-6 bg-[#9bc196]">
          <img src="icons/exchange.png" className="size-12" />
        </button>
      </div> */}

      {/* <div className="fixed bottom-6 left-0 w-full flex gap-4 justify-center items-center">
        <button className='bg-white text-2xl py-4 px-8 rounded font-bold w-[400px]'>START GAME</button>
      </div> */}

      {/* <div className="fixed bottom-6 left-0 w-full flex gap-4 justify-center items-center">
        <button className="bg-white rounded-full p-6 bg-[#efd897]">
          <img src="icons/challenge.png" className="size-12" />
        </button>
        <button className="bg-white rounded-full p-6 bg-[#f5a9a9]">
          <img src="icons/reject.png" className="size-12" />
        </button>
        <button className="bg-white rounded-full p-6 bg-[#b9b9b9]">
          <img src="icons/pass.png" className="size-12" />
        </button>
      </div> */}

      {/* <div className="fixed bottom-6 left-0 w-full flex gap-4 justify-center items-center">
        <button className="bg-white rounded-full">
          <img src="icons/ambassador-120.png" className="size-24" />
        </button>
        <button className="bg-white rounded-full">
          <img src="icons/assasin-120.png" className="size-24" />
        </button>
        <button className="bg-white rounded-full">
          <img src="icons/captain-120.png" className="size-24" />
        </button>
        <button className="bg-white rounded-full">
          <img src="icons/contessa-120.png" className="size-24" />
        </button>
        <button className="bg-white rounded-full">
          <img src="icons/duke-120.png" className="size-24" />
        </button>
      </div> */}
    </div>
  );
};

export default Board;