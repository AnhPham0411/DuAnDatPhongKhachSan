import { getRooms } from "@/actions/get-rooms";
import { RoomCard } from "@/components/public/room-card";

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Tất cả phòng nghỉ</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rooms.map((room) => (
                <RoomCard key={room.id} data={room} />
            ))}
        </div>
    </div>
  );
}