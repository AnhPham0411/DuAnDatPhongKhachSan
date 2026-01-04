import { getRooms, deleteRoom } from "@/actions/room-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2, Bed } from "lucide-react";

export default async function RoomsAdminPage() {
  const rooms = await getRooms();

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Phòng</h1>
        <Link href="/admin/rooms/new">
          <Button className="bg-slate-900"><Plus className="w-4 h-4 mr-2" /> Thêm phòng</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold uppercase">
            <tr>
              <th className="px-6 py-4">Hình ảnh</th>
              <th className="px-6 py-4">Tên phòng</th>
              <th className="px-6 py-4">Loại phòng</th>
              <th className="px-6 py-4">Giá cơ bản</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50 transition">
                {/* Cột Hình ảnh */}
                <td className="px-6 py-4">
                  <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden relative border">
                    {room.images[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={room.images[0].url} 
                        alt={room.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400"><Bed className="w-6 h-6"/></div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">{room.name}</td>
                <td className="px-6 py-4 text-blue-600">{room.roomType.name}</td>
                <td className="px-6 py-4 font-medium">
                  {Number(room.roomType.basePrice).toLocaleString()} đ
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    room.isAvailable 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {room.isAvailable ? 'Sẵn sàng' : 'Bảo trì'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <form action={deleteRoom.bind(null, room.id)}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      title="Xóa phòng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {rooms.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Chưa có phòng nào. Hãy thêm phòng mới.
          </div>
        )}
      </div>
    </div>
  );
}