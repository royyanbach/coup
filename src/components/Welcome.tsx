import { useRef } from "react";

type WelcomeProps = {
  onCreateRoom?: () => void;
  onJoinRoom?: (roomId: string) => void;
};

const Welcome = ({
  onCreateRoom = () => {},
  onJoinRoom = () => {},
}: WelcomeProps) => {
  const roomIdRef = useRef(null);
  const handleJoinRoom = () => {
    const roomIdInput = roomIdRef.current;
    if (!roomIdInput) return;
    const roomId = (roomIdInput as HTMLInputElement).value;
    onJoinRoom(roomId);
  };

  return (
    <>
      <picture className='mb-16'>
        <source media='(min-width: 768px)' srcSet='coup-360.png' />
        <img srcSet='coup-240.png' src='coup-360.png' />
      </picture>
      <div className='flex flex-col'>
        <button
          className='bg-white text-xl md:text-2xl py-4 px-8 rounded font-bold w-[300px] md:w-[400px]'
          onClick={onCreateRoom}
        >
          CREATE GAME
        </button>
        <hr className="w-48 h-px mx-auto my-5 md:my-10 bg-white border-0 rounded" />
        <div className='flex gap-2 w-[300px] md:w-[400px]'>
          <input
            className="w-9/12 bg-white bg-opacity-20 text-white text-center uppercase font-bold text-xl md:text-2xl py-4 px-8 rounded"
            placeholder="GAME ID"
            ref={roomIdRef}
            type="text"
          />
          <button
            className='bg-white text-xl md:text-2xl py-4 px-6 rounded font-bold'
            onClick={handleJoinRoom}
          >
            JOIN
          </button>
        </div>
      </div>
    </>
  );
};

export default Welcome;