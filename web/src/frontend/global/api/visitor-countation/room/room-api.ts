import axios from 'axios';

const Path = import.meta.env.VITE_VISITOR_API_URL + 'room';

const getRooms = async () => {
  const res = await axios.get(Path);

  return res.data;
};

export default { getRooms };
