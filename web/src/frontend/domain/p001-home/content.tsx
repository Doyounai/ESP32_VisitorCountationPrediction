import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import visitorApi from '../../global/api/visitor-countation/visitor/visitor-api';
import { IContentData } from '.';
import Room from './components/room/room';

const Content = (props: { domainName: string; data?: IContentData }) => {
  const { domainName, data } = props;
  const [currentRoom, setRoom] = useState<number>(0);
  const [roomsLog, setRoomLog] = useState<RoomLog[] | null>(null);

  useEffect(() => {
    const loadRoom = async () => {
      const res = await visitorApi.getVisitor(data?.rooms[currentRoom].room_id as string);

      console.log(res);

      res.res.map((item: RoomLog, i: number) => {
        const time = new Date(item.timestamp);

        res.res[i].timestamp = time.getHours() + ':' + time.getMinutes();
      });

      setRoomLog(res.res);
    };

    loadRoom();
  }, [currentRoom]);

  return (
    <div className="w-full h-screen flex ">
      {/* side bar */}
      <div className="w-[300px] h-full shadow-lg bg-slate-900 flex flex-col px-5 py-3">
        {/* header */}
        <div className="w-full">
          <h1 className="text-white mt-10 text-center">Visitor Countation</h1>
        </div>
        <hr></hr>
        {/* rooms */}
        <div className="w-full h-full flex flex-col py-10">
          <>
            {data?.rooms.map((item, i) => {
              return (
                <Room
                  roomname={item.room_name}
                  key={i}
                  isSelect={i == currentRoom}
                  onClick={() => {
                    setRoom(i);
                  }}
                />
              );
            })}
          </>
        </div>
      </div>
      {/* content */}
      <div className="white w-full h-full max-h-full px-15 py-20 flex flex-col overflow-y-scroll space-y-3">
        {/* row 1 */}
        <div className="w-full h-full flex space-x-3">
          <div className="bg-white px-5 py-5 h-[265px] w-[210px] shadow-lg rounded-md flex flex-col">
            <p className="w-full text-lg">current user</p>
            <div className="w-full h-full flex flex-col justify-center">
              <h1 className="text-5xl text-center">
                {data?.rooms[currentRoom].user_current}
              </h1>
            </div>
          </div>
        </div>
        {/* row 2 */}
        <div className="w-full h-full">
          <div className="w-full h-[500px] bg-white rounded-md px-5 py-3 flex flex-col">
            <div className="w-full">
              <h1 className="text-xl">user line graph</h1>
            </div>
            <div className="w-full h-full">
              {roomsLog != null ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={roomsLog}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="user_new" stroke="#8884d8" />
                    {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
