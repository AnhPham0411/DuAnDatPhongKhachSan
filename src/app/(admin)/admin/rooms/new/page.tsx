import { getRoomTypes } from "@/actions/get-data"; // Hàm lấy loại phòng bạn đã có
import { RoomForm } from "@/components/admin/room-form"; // Import component form bên dưới

export default async function NewRoomPage() {
  // Lấy dữ liệu ngay trên Server
  const roomTypes = await getRoomTypes();

  return (
    <div className="flex justify-center p-8">
      <RoomForm roomTypes={roomTypes} />
    </div>
  );
}