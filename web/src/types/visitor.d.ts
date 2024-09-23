export {};

declare global {
  interface Room {
    room_id: string;
    room_name: string;
    user_current: number;
    last_update: number;
  }

  interface RoomLog {
    visitor_id: number;
    room_id: number;
    user_current: number;
    user_new: number;
    user_diff: number;
    timestamp: string;
  }
}
