import axios from 'axios';

const Path = import.meta.env.VITE_VISITOR_API_URL + 'visitor/';

const getVisitor = async (id: string) => {
  const res = await axios.get(Path + id);

  return res.data;
};

export default { getVisitor };
