import classNames from "classnames";
import { useMemo, useState } from "react";
import { PLAYER_ICONS } from "../constants";
import useUserStore from "../stores/users"

const PlayerOverview = () => {
  const [isCharacterHidden, setIsCharacterHidden] = useState(true);
  const { currentUserId, users } = useUserStore();
  const myProfile = useMemo(() => users.find(u => u.id === currentUserId), [users, currentUserId]);
  const otherPlayers = useMemo(() => users.filter(u => u.id !== currentUserId), [users, currentUserId]);

  return (
    <ul className="flex gap-4 overflow-x-auto">
      <li
        className="bg-slate-800 px-4 py-2 md:py-4 rounded-lg text-white flex flex-col gap-2 flex-none"
        onClick={() => setIsCharacterHidden((prev) => !prev)}
      >
        <p className="text-center text-2xl font-bold">{myProfile?.profileIcon ? PLAYER_ICONS[myProfile.profileIcon] : ''}</p>
        <div className={
          classNames(
            "flex gap-2 relative before:content-['Tap_to_switch_view'] before:text-center before:text-xs before:size-full before:bg-gray-600/80 before:rounded before:flex before:items-center before:justify-center before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2",
            {
              "before:hidden": !isCharacterHidden
            }
          )
        }>
          <img src="icons/coup-square-60.png" className="size-12" />
          <img src="icons/coup-square-60.png" className="size-12" />
        </div>
        <p className="text-center text-xs">{myProfile?.coins} COINS</p>
      </li>
      {otherPlayers.map(user => (
        <li key={user.id} className="bg-slate-800 px-4 py-2 md:py-4 rounded-lg text-white flex flex-col gap-2 flex-none">
          <p className="text-center text-2xl font-bold">{PLAYER_ICONS[user.profileIcon]}</p>
          <div className="flex gap-2 relative">
            <img src="icons/coup-square-60.png" className="size-12" />
            <img src="icons/coup-square-60.png" className="size-12" />
          </div>
          <p className="text-center text-xs">{user.coins} COINS</p>
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
  )
}

export default PlayerOverview;
