import { useEffect } from 'react';

import FirebaseAPI from '../../global/api/firebase';
import visitorCountation from '../../global/api/visitor-countation';
import { IContentData } from '.';

const Preload = (props: IPreloadProps<IContentData>) => {
  const loadUser = async () => {
    const rooms = await visitorCountation.Room.getRooms();

    return rooms.err == null ? rooms.res : [];
  };

  useEffect(() => {
    (async () => {
      const rooms = await loadUser();

      props.onLoadComplete({
        rooms: rooms,
      });
    })();
  }, []);

  return <>Loading...</>;
};

export default Preload;
