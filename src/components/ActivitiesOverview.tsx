import { PLAYER_ICONS, ROOM_EVENTS, RoomEvent } from "../constants";
import useGameStore from "../stores/game";
import useUserStore from "../stores/users";

const ActivitiesOverview = () => {
  const { activities } = useGameStore();
  const { myProfile, users } = useUserStore((state) => ({
    myProfile: state.users.find(u => u.id === state.currentUserId),
    users: state.users,
  }));

  const getUserProfileIcon = (userId?: string) => {
    const iconKey = users.find(u => u.id === userId)?.profileIcon;
    if (iconKey) {
      return PLAYER_ICONS[iconKey];
    }
  }

  const formatActivity = (activity: RoomEvent) => {
    let profileIcon;
    switch (activity.eventType) {
      case ROOM_EVENTS.GAME_STARTED:
        return 'Game started';
      case ROOM_EVENTS.ROOM_CREATED:
        profileIcon = getUserProfileIcon(activity.users[0].id);
        return profileIcon ? `${profileIcon} created a new game` : null;
      case ROOM_EVENTS.ROOM_JOINED:
        profileIcon = getUserProfileIcon(myProfile?.id);
        return profileIcon ? `${profileIcon} joined the game` : null;
      case ROOM_EVENTS.PLAYER_JOINED:
        profileIcon = getUserProfileIcon(activity.user.id);
        return profileIcon ? `${profileIcon} joined the game` : null;
      default:
        return 'Unknown activity';
    };
  }

  return (
    <section className="flex gap-4 w-full grow main text-white w-full overflow-y-auto p-4 rounded-lg">
      <ul className="w-full flex flex-col gap-1 md:gap-2">
        {activities.filter(Boolean).map((activity, index) => (
          <li key={index} className="font-light">{formatActivity(activity)}</li>
        ))}
        {/* <li className="font-light">Game started</li>
        <li className="font-light">❤️ perform <strong className="font-bold text-[#464867]">assasin</strong> to 💩</li>
        <li className="font-light">💩 perform <strong className="font-bold text-[#bd8fae]">tax</strong></li>
        <li className="font-light">😒 perform <strong className="font-bold ">challenge</strong> to 💩</li> */}
      </ul>
    </section>
  );
};

export default ActivitiesOverview;