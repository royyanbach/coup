const Header = ({
  roomCode,
} = {}) => {
  if (!roomCode) return null;
  return (
    <header className='w-full flex gap-2 justify-center items-center fixed text-white p-3 md:p-6 text-lg top-0 left-0'>
      <span className='select-none'>GAME ID:</span>
      <strong className='text-2xl'>{roomCode}</strong>
    </header>
  )
}

export default Header;