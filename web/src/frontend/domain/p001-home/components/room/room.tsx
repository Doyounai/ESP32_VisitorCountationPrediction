const Room = (props: { roomname: string; isSelect: boolean; onClick: () => void }) => {
  const { roomname, isSelect, onClick } = props;

  return (
    <>
      <button
        className={
          'w-full text-center rounded-lg shadow-lg py-5 ' + (isSelect ? 'bg-sky-900' : '')
        }
        onClick={() => {
          onClick();
        }}
      >
        <p className="text-white text-lg">{roomname}</p>
      </button>
    </>
  );
};

export default Room;
