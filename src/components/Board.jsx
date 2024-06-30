import { EVENT_NAME, PLAYER_ICONS } from "../constants";

const Board = ({
  activities = [],
  connectedUsers = [],
  onChangePlayerIcon = () => {},
  mySocketId = '',
} = {}) => {
  const myProfile = connectedUsers.find(u => u.id === mySocketId);

  const getUserProfileIcon = (userId) => {
    return connectedUsers.find(u => u.id === userId)?.profileIcon;
  }

  const formatActivity = (activity) => {
    switch (activity.eventType) {
      case EVENT_NAME.CREATE_ROOM:
        return `${getUserProfileIcon(activity.actor)} created a new game`;
      case EVENT_NAME.JOIN_ROOM:
      case EVENT_NAME.PLAYER_JOINED:
        return `${getUserProfileIcon(activity.actor)} joined the game`;
      default:
        return 'Unknown activity';
    };
  }

  return (
    <div className="w-full h-full px-6 pt-[88px] pb-[128px] flex flex-col gap-8">
      <ul className="flex gap-4 overflow-x-auto">
        {connectedUsers.map(user => (
          <li key={user.id} className="bg-slate-800 p-4 rounded-lg text-white w-[180px] flex flex-col gap-2 flex-none">
            <span className="font-bold">{user.profileIcon} ({user.coins} COINS)</span>
            <div className="flex gap-2">
              <img src="icons/duke-60.png" className="size-12" />
              <img src="icons/coup-square-60.png" className="size-12" />
            </div>
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

      <div className="flex gap-4 w-full h-[50%]">
        <aside className="text-white w-[300px] border-gray-700 border-r p-4 flex flex-col gap-2">
          <p className="text-3xl">{myProfile?.profileIcon} {myProfile?.coins} Coins</p>
          <ul className="flex gap-2 relative before:content-['Tap_and_hold_to_switch_cards_view'] before:text-center before:text-sm before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2">
            <li>
              <img src="icons/coup-square-120.png" className="size-24 opacity-15" />
            </li>
            <li>
              <img src="icons/coup-square-120.png" className="size-24 opacity-15" />
            </li>
          </ul>
        </aside>
        <main className="main text-white w-full overflow-auto p-4 rounded-lg">
          <ul>
            {activities.map((activity, index) => (
              <li key={index} className="font-light">{formatActivity(activity)}</li>
            ))}
            {/* <li className="font-light">Game started</li>
            <li className="font-light">❤️ perform <strong className="font-bold text-[#464867]">assasin</strong> to 💩</li>
            <li className="font-light">💩 perform <strong className="font-bold text-[#bd8fae]">tax</strong></li>
            <li className="font-light">😒 perform <strong className="font-bold ">challenge</strong> to 💩</li> */}
          </ul>
        </main>
      </div>

      <div className="fixed bottom-6 left-0 w-full flex gap-4 px-4 justify-center items-center">
        <div className="flex gap-4 items-center">
          <button className="bg-white rounded-full p-6 size-24">
            <img src="icons/start.png" className="size-12" />
          </button>
          <hr width="1" size="500" className="h-[45px] w-px bg-white mx-4" />
        </div>
        <div className="flex gap-4 items-center overflow-x-scroll">
          {Object.entries(PLAYER_ICONS).map(([key, value]) => (
            <button
              className="bg-white rounded-full text-center bg-[#b9b9b9] text-5xl size-24 flex-none"
              key={key}
              onClick={() => onChangePlayerIcon(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

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