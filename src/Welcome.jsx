const Welcome = () => {
  return (
    <>
      <img src='coup-360.png' className='mb-16' />
      <div className='flex flex-col'>
        <button className='bg-white text-2xl py-4 px-8 rounded font-bold w-[400px]'>CREATE GAME</button>
        <hr className="w-48 h-px mx-auto my-10 bg-white border-0 rounded" />
        <div className='flex gap-2 w-[400px]'>
          <input type="text" placeholder="ROOM ID" className="w-9/12 bg-white bg-opacity-20 text-white text-center uppercase font-bold text-2xl py-4 px-8 rounded" />
          <button className='bg-white text-2xl py-4 px-6 rounded font-bold'>JOIN</button>
        </div>
      </div>
    </>
  );
};

export default Welcome;